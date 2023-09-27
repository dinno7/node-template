class APIFeatures {
  constructor(initialQuery, queryStr) {
    this.query = initialQuery;
    this.queryStr = queryStr;
  }

  filter() {
    const reqQuery = { ...this.queryStr };
    const excludeQuery = ['sort', 'page', 'limit', 'fields'];
    excludeQuery.forEach((item) => delete reqQuery[item]);

    // >> This is for when you wanna get for ex duration[gt] and convert gt to $gt
    let filters = JSON.stringify(reqQuery);
    filters = filters.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    filters = JSON.parse(filters);

    this.query = this.query.find(filters);
    return this;
  }

  sort() {
    let sortStr = this.queryStr.sort;
    if (sortStr) {
      sortStr = sortStr.replace(/,/g, ' ');
      this.query = this.query.sort(sortStr);
    }
    return this;
  }

  limitFields() {
    let fieldsStr = this.queryStr.fields;
    if (fieldsStr) {
      fieldsStr = fieldsStr.replace(/,/g, ' ');
      this.query = this.query.select(fieldsStr);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate(defaultPage = 1, defaultLimit = 100) {
    const page = +this.queryStr.page || defaultPage;
    const limit = +this.queryStr.limit || defaultLimit;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;
