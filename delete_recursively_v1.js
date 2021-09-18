use('sample_airbnb');
fieldsArray = [];

docKeysArray = db.customers.aggregate([
  {$project: {data: {$objectToArray: "$$ROOT"}}},
  {$addFields: {
      fields: "$data.k",
      data: {
        $map: {
          input: {$filter: {
              input: "$data",
              cond: {$eq: ["object",{$type: "$$this.v"}]}
          }},
          in: {
            v: {
              $map: {
                input: {$objectToArray: "$$this.v"},
                as: "sub",
                in: {
                  k: {$concat: ["$$this.k",".","$$sub.k"]},
                  v: "$$sub.v"
                }
              }
            }
          }
        }
      }
  }},
  {$addFields: {
      data: {$reduce: {
          input: "$data",
          initialValue: [],
          in: {$concatArrays: ["$$value", "$$this.v"]}
      }}
  }},
  {$addFields: {
      fields: {$concatArrays: ["$fields","$data.k"]},
      data: {
        $map: {
          input: {$filter: {
              input: "$data",
              cond: {$eq: ["object",{$type: "$$this.v"}]}
          }},
          in: {
            v: {
              $map: {
                input: {$objectToArray: "$$this.v"},
                as: "sub",
                in: {
                  k: {$concat: ["$$this.k",".","$$sub.k"]},
                  v: "$$sub.v"
                }
              }
            }
          }
        }
      }
  }},
  {$addFields: {
      data: {$reduce: {
          input: "$data",
          initialValue: [],
          in: {$concatArrays: ["$$value", "$$this.v"]}
      }}
  }},
  {$addFields: {
      fields: {$concatArrays: ["$fields","$data.k"]},
      data: {
        $map: {
          input: {$filter: {
              input: "$data",
              cond: {$eq: ["object",{$type: "$$this.v"}]}
          }},
          in: {
            v: {
              $map: {
                input: {$objectToArray: "$$this.v"},
                as: "sub",
                in: {
                  k: {$concat: ["$$this.k",".","$$sub.k"]},
                  v: "$$sub.v"
                }
              }
            }
          }
        }
      }
  }},

  {$addFields: {

      data: {$reduce: {

          input: "$data",

          initialValue: [],

          in: {$concatArrays: ["$$value", "$$this.v"]}

      }}

  }},

  {$project: {

     fields: {$concatArrays: ["$fields","$data.k"]}

  }}

]).toArray();


async function asyncForEach(array, callback) {

  for (let index = 0; index < array.length; index++) {

    await callback(array[index], index, array);

  }

}


asyncForEach(docKeysArray, async (docKeys) => {

    //console.log(JSON.stringify(docKeys));

    doc = db.customers.findOne({_id : ObjectId(docKeys._id)});

    //console.log(JSON.stringify(doc));

    if (doc.name == 'Example 1') {

        fieldsArray = ["address", "gender"];

        //console.log("Inside 1");

    }

    else if (doc.name == 'Example 2') {

        fieldsArray = ["address", "age"];

        //console.log("Inside 2");


    }

    else if (doc.name == 'Example 3') {

        fieldsArray = ["LAT", "LON"];

        //console.log("Inside 3");

    }

    fieldsArray.forEach(function (field) {

        //console.log('.*' + field + '$');

        fieldRegex = new RegExp('.*' + field + '$');

        docKeys.fields.forEach(function (docKey) {

            if ((fieldRegex.test(docKey))) {

                db.customers.updateOne(

                    { 

                        _id : ObjectId(doc._id) 

                    }, 

                    { 

                        $unset: 

                        { 

                            [docKey]: "" 

                        } 

                    }

                );
            }
        });
    });
})
