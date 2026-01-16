import mongoose from 'mongoose'

const TestSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    unit:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:['timer','distance','count'],
        required:true
    }
})

export default mongoose.model('Test',TestSchema)