const mongoose = require('mongoose');
const { default: slugify } = require('slugify');
const slugify = require('slugify');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique:true,
    set:(value)=>slugify(value, { lower: true }),
  },
  content: {
    type: String,
    required: true,
  },
//   author: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  slug: { 
    type: String, 
    slug: 'title',
    unique:'true'
}

});

postSchema.pre('validate', function (next) {
    this.slug = slugify(this.title, { lower: true });
    next();
  });

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;
