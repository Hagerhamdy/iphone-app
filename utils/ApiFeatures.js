class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    filter() {
        const queryStringObj = { ...this.queryString };
        const excludesFields = ["limit", "page", "sort", "fields"];

        excludesFields.forEach(field => {
            excludesFields.filter(item => queryStringObj[field] !== item);
        });
        let queryStr = JSON.stringify(queryStringObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
        return this
    }

    paginate(countDocuments) {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 50;
        const skip = (page - 1) * limit;
        const endIndex = page * limit //end page of current page (2 * 10 = 20)

        const pagination = {};
        pagination.curruntPage = page;
        pagination.limit = limit;
        pagination.numberOfPages = Math.ceil(countDocuments / limit);

        //next page
        if (endIndex < countDocuments) {
            pagination.next = page + 1;
        }

        //previos page
        if (skip > 0) {
            pagination.prev = page - 1;
        }

        this.mongooseQuery = this.mongooseQuery.find().skip(skip).limit(limit);
        this.paginationResult = pagination;
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
            this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields);
        } else {
            this.mongooseQuery = this.mongooseQuery.select('-__v');
        }
        return this;
    }

    search(modalName) {
        if (this.queryString.keyword) {
            const query = {};
            if (modalName === 'Product')
                query.$or = [
                    { title: { $regex: this.queryString.keyword, $options: "i" } },
                    { description: { $regex: this.queryString.keyword, $options: "i" } }
                ];
            else
                query.$or = [
                    { name: { $regex: this.queryString.keyword, $options: "i" } },
                ];
            this.mongooseQuery = this.mongooseQuery.find(query);
        }
        return this;

    }
}

module.exports = ApiFeatures;

