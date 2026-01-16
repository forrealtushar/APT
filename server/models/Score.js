import mongoose from "mongoose";

const ScoreSchema = new mongoose.Schema({
    athlete:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Athlete',
        require:true
    },
    test:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Test',
        require:true
    },
    score:{
        type:Number,
        require:true
    }
},{timestamps:true})

export default mongoose.model('Score',ScoreSchema)