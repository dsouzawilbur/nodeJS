var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = "mongodb+srv://wilburdsouza:D915gvwb@cluster0.f8dzy.mongodb.net/";


MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db("sample_airbnb");

  dbo.collection("customers").find().forEach(function (doc) {
    var docKeysArray = [];
    docKeysArray = getDeepKeys(doc);
    //console.log(docKeysArray);
    if (doc.name == 'Example 1') {
      //console.log(doc);
      var fieldsArrayToUse = "BRA"
      deleteFields(fieldsArrayToUse, docKeysArray, doc);
    }
  });
});

function deleteFields(fieldsArrayToUse, docKeysArray, doc) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("sample_airbnb");
    var fieldsArray = [];
    if (fieldsArrayToUse == "AUS") {
      fieldsArray = ["address", "gender"];
    }
    else if (fieldsArrayToUse == "BRA") {
      fieldsArray = ["position", "documentType"];
    }
    fieldsArray.forEach(function (field) {
      console.log('.*' + field + '$');
      const fieldRegex = new RegExp('.*' + field + '$');
      docKeysArray.forEach(function (docKey) {
        if ((fieldRegex.test(docKey))) {
          if (err) throw err;
          dbo.collection('customers').updateOne({ "_id": new ObjectId(doc._id) }, { $unset: { [docKey]: "" } },).then((obj) => {
            console.log('Updated');
          });
        }
      });
    });
  });
}

function getDeepKeys(obj) {
  var keys = [];
  const idRegex = new RegExp('_id.*');
  for (var key in obj) {
    if (!(idRegex.test(key))) { //exclude the id fields from the final keys array
      keys.push(key);
      if (typeof obj[key] === "object") {
        var subkeys = getDeepKeys(obj[key]);
        keys = keys.concat(subkeys.map(function (subkey) {
          return key + "." + subkey;
        }));
      }
    }
  }
  return keys;
}