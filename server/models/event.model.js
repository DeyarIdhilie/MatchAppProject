const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GeoSchema = new Schema({
    type: {
      type: String,
      default: "Point"
    },
    coordinates: {
        type:[Number],
        index: "2dsphere"
    }
});
const Event = Schema({
   
    creator: {
        type: mongoose.Schema.Types.String,
        required: true,
        ref: "User",
      },
    image : String,
    title: String,
    description : String,
    startDate : Date,
    endDate:Date,
    maxCapacity: Number,
    geometry: GeoSchema,
    attendence: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    tags: {type: [String]}
  });
  module.exports= mongoose.model("Event",Event);