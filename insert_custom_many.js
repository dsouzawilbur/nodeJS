var MongoClient = require('mongodb').MongoClient;
var url = "URI";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("sample_airbnb");
  var myobj = [
    { name: "Example 1", address: "Highway 1", documentType: null , personalDetails: { gender: "male", age: 23, position: null }},
    { name: "Example 2", address: "Highway 2", documentType: "details" , personalDetails: { gender: "male", age: 23, position: null }},
    { name: "Example 2", documentType: "details" , personalDetails: { gender: "male", age: 23, position: null,  address: { street: "NYJ", pincode: "5555"}}}
  ];
  dbo.collection("customers").insertMany(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});
