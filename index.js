




const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 8080;
const url = 'mongodb://localhost:27017/UBIT';

// Middleware
app.use(express.json());


const studentsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  { timestamps: true }
);

const Users = mongoose.model('students', studentsSchema);



// Routes
app.get('/user', 
(req,res,next)=>{

  let token = req.headers.authorization;
  if(token && token==='123456'){
    next();
  }else{
    res.status(401).send(
      {
        status: 'error',
        message: 'Unauthorized',
      }
    );
  }


} , 
(req, res) => {

  Users.find().then((students) => {
    let data = students.map((student) => {
      return {
        id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone
      };
    });

    res.status(200).send(
      {
        status: 'success',
        message: 'Hello World!',
        data: data,
      }
    );
  })
    .catch((err) => {
      console.error(err);
    });
});

app.post('/user', (req, res) => {

  const user = new Users(req.body);
  user.save().then((student) => {
    let data = {
      id: student._id,
      name: student.name,
      email: student.email,
      phone: student.phone
    }
    res.status(200).send(
      {
        status: 'success',
        message: 'Hello World!',
        data: [data],
      }
    );
  });
});

app.put('/user/:id', (req, res) => {
  let id = req.params.id;
  let data = req.body;
  Users.findByIdAndUpdate(id, data,{}).then((student) => {
    res.status(200).send(
      {
        status: 'success',
        message: 'Hello World!',
        data: [student],
      }
    );
  });
});

app.delete('/user/:id', (req, res) => {
  let id = req.params.id;
  Users.findByIdAndDelete(id).then(() => {
    res.status(200).send(
      {
        status: 'success',
        message: 'User Deleted!',
      }
    );
  });
});


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
}
);



