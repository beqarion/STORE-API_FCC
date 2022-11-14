const Product = require("../models/product")

const getAllProductsStatic = async (req, res, next) => {
  const products = await Product.find({})
    .sort("name")
    .select("name price")
    .limit(10)
    .skip(1)
  res.status(200).json({ products, nbHits: products.length })
}

const getAllProducts = async (req, res, next) => {
  const { featured, company, name, sort, fields } = req.query
  console.log(fields)
  const queryObject = {}

  if (featured) {
    queryObject.featured = featured === "true" ? true : false
  }
  if (company) {
    queryObject.company = company
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" }
  }

  let result = Product.find(queryObject)
  //sort
  if (sort) {
    const sortList = sort.split(",").join(" ")
    result = result.sort(sortList)
  } else {
    result = result.sort("createdAt")
  }

  if (fields) {
    const fieldList = fields.split(",").join(" ")
    result = result.select(fieldList)
  }
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  result = result.skip(skip).limit(limit)

  
  const products = await result.sort(sort)

  res.status(200).json({ products, nbHits: products.length })
}

module.exports = {
  getAllProducts,
  getAllProductsStatic,
}
