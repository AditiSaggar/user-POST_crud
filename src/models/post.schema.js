const mongoose = require('mongoose');
// const { default: slugify } = require('slugify');
//const slugify = require('slugify');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique:true,
    
  },
  subtitle:{
    type: String,
    required: true,
    unique:true,

  },
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  slug: { 
    type: String, 
    slug: 'title',
    unique:'true'
},
createdAt: {
  type: Date,
  required: true,
},
updatedAt: {
  type: Date,
  required: true,
}

});

// postSchema.pre('validate', function (next) {
//     this.slug = slugify(this.title, { lower: true });
//     next();
//   });

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;
