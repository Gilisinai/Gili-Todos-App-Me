const Todo = require('../models/todo')

exports.createTodo = (req, res, next) => {
    const todo = new Todo({
        title: req.body.title,
        content: req.body.content,
        creator: req.userData.userId
    })
    todo.save().then(createdPost => {
        res.status(201).json({
            message: 'Poast added successfully',
            postId: createdPost._id
        })
    })
    .catch(error => {
        res.status(500).json({
            message: 'Creating a post failed!'
        })
    })
}

exports.updateTodo = (req, res, next) => {
    const todo = new Todo({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        creator: req.userData.userId
    })
    Todo.updateOne({_id: req.params.id, creator: req.userData.userId}, todo).then(result => {
        if(result.n > 0) {
            res.status(200).json({message: 'Update successfull'})
        } else {
            res.status(401).json({message: 'Not authorized'})
        }
    })
    .catch(error => {
        res.status(500).json({
            message: 'Could not update post!'
        })
    })
}

exports.getTodos = (req, res, next) => {
    const pageSize = +req.query.pagesize
    const currentPage = +req.query.page
    
       
    const postQuery = Todo.find({creator: req.query.userid})
    let fetchedPosts;
    if(pageSize && currentPage) {
        postQuery
         .skip(pageSize * (currentPage - 1))
         .limit(pageSize)
    }
    postQuery
        .then(documents => {
            fetchedPosts = documents
            return Todo.count()
        })
        .then( count => {
            res.status(200).json({
                message: 'Post fetched successfully',
                posts: fetchedPosts,
                maxPosts: count
            })
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching posts failed!'
            })
        })
}

exports.getTodo = (req, res, next) => {
    Todo.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post)
        } else {
            res.status(404).json({message: 'Post not found!'})
        }
    })
    .catch(error => {
        res.status(500).json({
            message: 'Fetching post failed!'
        })
    })
}

exports.toggleDone = (req, res, next) => {
    // console.log("before update" , req.body.isCompleted)
    
    Todo.findByIdAndUpdate({_id: req.params.postid}, {isCompleted: !req.body.isCompleted}, {new: true}).then(result => {
        // console.log("after update" , result.isCompleted)
        
            res.status(200).json({message: 'Update successfull', result: result})

    })
    .catch(error => {
        res.status(500).json({
            message: 'Could not update post!'
        })
    })
}

exports.deleteTodo = (req, res, next) => {
    Todo.deleteOne({_id: req.params.id, creator: req.userData.userId}).then( result => {
        if(result.n > 0) {
            res.status(200).json({message: 'Deleted successfull'})
        } else {
            res.status(401).json({message: 'Not authorized'})
        }
    })
    .catch(error => {
        res.status(500).json({
            message: 'Delete post failed!'
        })
    })
}