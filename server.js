const blogs = [
  {
    id: 1,
    title: 'Node Js',
    author: "Jhon Doe",
    content: 'Node.js is a cross-platform, open-source JavaScript runtime environment built on Chrome V8 engine that allows developers to execute JavaScript code outside a web browser efficiently.'
  },
  {
    id: 2,
    title: 'Angular',
    author: "May Doe",
    content: 'Angular is a cross-platform, open-source front-end framework built by Google using TypeScript, used for building dynamic single-page applications with components, services, and modules.'
  }
]

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;



app.use(cors({
  origin: "*",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', "PATCH", "DELETE"]
}))

app.use(express.json());

app.get('/blogs', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: blogs
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetch blogs..!!',
      error: err.message
    })
  }

})



app.get('/blogs/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const blog = blogs.find((b) => b.id == id);

    if (!blog) {
      return res.status(404).json({
        status: false,
        message: `Blog with id ${id} is not found`
      })
    }

    res.status(200).json({
      status: true,
      data: blog
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error to fetch blogs !!',
      error: err.message
    })
  }
})



app.post('/blogs', (req, res) => {
  try {

    let { title, content, author } = req.body;   

    if (!title || !content) {
      return res.status(400).json({
        success: false,                          
        message: 'title & content required'
      })
    }

    let newObj = {
      title,
      content,                                   
      author: author || 'Anonymous',
      id: blogs.length + 1
    }

    blogs.unshift(newObj);

    res.status(201).json({
      success: true,
      data: newObj,
      message: `The blog is created successfully`
    })


  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error while creating blog",
      error: err.message
    })
  }

})


app.delete('/blogs/:id', (req, res) => {
  try {
    let id = Number(req.params.id)

    let getindex = blogs.findIndex(b => b.id === id);

    if (getindex === -1) {
      return res.status(404).json({
        success: false,
        message: `blog with id ${id} is  not found`
      })
    }

    blogs.splice(getindex, 1);

    res.status(200).json({
      success: true,
      data: blogs,
      message: 'blog is deleted successfully'
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error while deleting blog',
      error: err.message
    })
  }
})



app.patch('/blogs/:id', (req, res) => {

  try {
    let blogId = req.params.id;
    const { title, content } = req.body;          
    let getIndex = blogs.findIndex(post => post.id == blogId);

    if (getIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Blog with id ${blogId} not found`
      })
    }

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'title or content is required'  
      })
    }                                                

    let updatedBlogs = {
      ...blogs[getIndex],
      ...req.body,
      updatedAt: Date.now().toString()
    }

    blogs[getIndex] = updatedBlogs;

    res.status(200).json({
      success: true,
      message: `the blog with id ${blogId}`,
      data: updatedBlogs
    })

  }
  catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
})




app.listen(PORT, () => {
  console.log(`server is running on Port: http://localhost:${PORT}/blogs`)
})