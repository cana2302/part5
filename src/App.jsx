import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [message, setMessage] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  //check user localStorage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  //getAll blogs from backend
  useEffect(() => {
    blogService
    .getAll()
    .then(blogs => {
      setBlogs( blogs )
    })  
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setNotification('authorization')
      setMessage('success')
      setTimeout(() => {
        setMessage(null)
        setNotification(null)
      }, 5000)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification('wrong username or password')
      setMessage('error')
      setTimeout(() => {
        setMessage(null)
        setNotification(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  //create new blogs:

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    blogService
      .create(blogObject)
        .then(returnBlog => {
          setBlogs(blogs.concat(returnBlog))
          setNotification('a new blog '+ blogObject.title+' by '+ blogObject.author + ' added')
          setMessage('success')
          setTimeout(() => {
            setMessage(null)
            setNotification(null)
          }, 5000)
          setNewTitle('')
          setNewAuthor('')
          setNewUrl('')
        })
  }

  const blogForm = () => (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <p>title<input value={newTitle} onChange={handleTitleChange}/></p>
        <p>author<input value={newAuthor} onChange={handleAuthorChange}/></p>
        <p>url<input value={newUrl} onChange={handleUrlChange}/></p>
        <button type="submit">create</button>
      </form>
    </div>  
  )

  const bodyBlog = () => (
    <div>
      <h2>blogs</h2>
      <Notification message={message} notification={notification} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button> </p>
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>     
  )

  //render:
  if (user === null) {
    return (
      <div>
      <h2>Log in to application</h2>
      <Notification message={message} notification={notification} />
      {loginForm()}
    </div>
    )
  }

  return (
    <>
      {bodyBlog()}
    </>
   
  )
}

export default App