import express from 'express';
import Athlete from '../models/Athlete.js';
import Test from '../models/Test.js';
import Score from '../models/Score.js';

const router = express.Router();

// GET all Athletes
router.get('/athletes', async (req, res) => {
  try {
    const athletes = await Athlete.find().sort({ createdAt: -1 });
    res.json(athletes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE a new Athlete
router.post('/athletes', async (req, res) => {
  const { name, age} = req.body;
  try {
    const newAthlete = new Athlete({ name, age });
    await newAthlete.save();
    res.status(201).json(newAthlete);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// CREATE a Test 
router.post('/tests', async (req, res) => {
  const { name, unit, type } = req.body; // type must be 'timer' or 'distance'
  try {
    const newTest = new Test({ name, unit, type });
    await newTest.save();
    res.status(201).json(newTest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET all Tests 
router.get('/tests', async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// SUBMIT a Score
router.post('/scores', async (req, res) => {
  const { athleteId, testId, score } = req.body;
  try {
    const newScore = new Score({ 
      athlete: athleteId, 
      test: testId, 
      score: score 
    });
    await newScore.save();
    res.status(201).json(newScore);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/leaderboard/:testId', async (req, res) => {
  try {
    const { testId } = req.params;
    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });
    const scores = await Score.find({ test: testId })
      .populate('athlete', 'name team') 
      .exec();
    scores.sort((a, b) => {
      if (test.type === 'timer') {
        return a.score - b.score; 
      } else {
        return b.score - a.score; 
      }
    });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/scores/:id', async (req, res) => {
  try {
    await Score.findByIdAndDelete(req.params.id);
    res.json({ message: "Score deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/athletes/:id', async (req, res) => {
  try {
    await Athlete.findByIdAndDelete(req.params.id);
    res.json({ message: "Athlete deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/tests/:id',async(req,res)=>{
  try{
    await Test.findByIdAndDelete(req.params.id)
    res.json({message: "Test deleted"})
  }catch(error){
    res.status(500).json({message: error.message})
  }
})

export default router;