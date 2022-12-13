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

const User =Schema({
    firstname:{
    type : String,
    required : true,
    },
    lastname:{
        type : String,
        required : true,
        },

    password:{
        type: String,
        required:true,
    },
    phonenumber:{
        type:String,
        required:true,
        unique : true,
    },
    email:{
        type : String,
        required : true,
        unique :true,
    },
    is_admin:{
        type : Boolean,
        default: 0
    },
    is_active:{
        type : Boolean,
        default: 0
    },
    profile: {
        username: String,
        avatar: String,
        bio: String,
        gender: { type: String,
            enum: [ "Female", "Male" ]
        },
        birthdate : Date,
        events: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
    },
    geometry: GeoSchema
});
const Event = Schema({
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
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
  
  const Story = mongoose.model('Event', Event);
module.exports= mongoose.model("User",User);