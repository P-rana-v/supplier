import { useState,createContext,useContext } from "react";
import logo from "./logo.png"

const PostsContext=createContext()

const Form = () => {
    const [name, setName] = useState("");
    const [item, setItem] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [image,setImage] = useState(null)
    const [loggedIn,setLoggedIn] = useState(false)
    const [signUp,setSignUp]=useState(false)
    const [logEmail,setLogEmail]=useState("")
    const [pass,setPass]=useState("")
    const [reEnter,setReEnter]=useState("")
    const posts=useState()
    const [userInfo,setUserInfo]=useState({email: "",data: []})
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
        const formData= new FormData()
        formData.append('image',image)
        const data = {
          name: name,
          item: item,
          phone: phone,
          email: email,
          logEmail: logEmail
        }
        const response = await fetch('/api/data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data }),
        });
        if (response.ok) {
          console.log('Data submitted successfully');
        } else {
          console.log('Failed to submit data');
        }
        const responseImage = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (responseImage.ok) {
          console.log('Image uploaded successfully');
        } else {
          console.log('Failed to upload image');
        }
      } catch (error) {
        console.log('Error submitting data:', error);
      }
    };
  
    const handleName = (e) => {
      setName(e.target.value)
    };
    const handleItem = (e) => {
      setItem(e.target.value)
    };
    const handlePhone = (e) => {
      setPhone(e.target.value)
    };
    const handleEmail = (e) => {
      setEmail(e.target.value)
    };
    const handleImage = (e) => {
      setImage(e.target.files[0])
    }
    const handleSignUp = () => {
      setSignUp(!signUp)
    }
    if(!loggedIn){
      if(!signUp){
        const handleLogIn = async (event) => {
          event.preventDefault()
          try{
            fetch(`/login?email=${logEmail}&pass=${pass}`)
            .then(item => item.json())
            .then(item => {
              if (item.result==="success") {
                setLoggedIn(true)
                setUserInfo({email: logEmail})
              }
            })
          }
          catch(err) {
            console.log("Error submitting data",err)
          }
        }
        const changePass = (event) => {
          setPass(event.target.value)
        }
        const changeLogEmail = (event) => {
          setLogEmail(event.target.value)
        }
        return(
          <div className="login">
            <img className="logo2" alt="logo" src={logo}></img>
            <form onSubmit={handleLogIn} className="login-flex">
              <div>
                <label>Email</label>
                <input required onChange={changeLogEmail} className="inputField" type="email"></input>
              </div>
              <div>
                <label>Password</label>
                <input required onChange={changePass} className="inputField" type="password"></input>
              </div>
              <div>
                <button type="submit" onSubmit={handleLogIn}>Log In</button>
                <button onClick={handleSignUp}>Sign Up Instead</button>
              </div>
            </form>
          </div>
        )
      }
      else {
        const changePass = (event) => {
          setPass(event.target.value)
        }
        const changeReEnter = (event) => {
          setReEnter(event.target.value)
        }
        const changeLogEmail = (event) => {
          setLogEmail(event.target.value)
        }
        const handleNewSignUp = async (event) => {
          event.preventDefault()
          try{
            let info = {}
            info[logEmail]={password: pass}
            const response = await fetch('/signup', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ info }),
            })
            if (response.ok) {
              console.log('Data submitted successfully');
            } else {
              console.log('Failed to submit data');
            }
            setLoggedIn(true)
            setUserInfo({email: logEmail})
          }
          catch(err) {
            console.log("Error submitting data",err)
          }
        }
        return(
          <div className="login">
            <img className="logo2" alt="logo" src={logo}></img>
            <form onSubmit={handleNewSignUp} className="login-flex signup">
              <div>
                <label>Email</label>
                <input required onChange={changeLogEmail} className="inputField" type="email"></input>
              </div>
              <div>
                <label>Password</label>
                <input required onChange={changePass} className="inputField" type="password"></input>
              </div>
              <div>
                <label>Re enter Password</label>
                <input required onChange={changeReEnter} className="inputField" type="password"></input>
                <label className="warning">Password must contain atleast 8 characters</label>
              </div>
              <div>
                {(pass===reEnter&&pass.length>=8) && <button type="submit" onSubmit={handleNewSignUp} >Sign Up</button>}
                {(pass!==reEnter||pass.length<8) && <button disabled>Sign Up</button>}
                <button onClick={handleSignUp}>Log In Instead</button>
              </div>
            </form>
          </div>
        )
      }
    }
    const handlePosts = () => {
      fetch('/data')
      .then(item => item.json())
      .then(item => {
        let tempData=[]
        item.data.forEach((element,index)=> {
          if(element.logEmail===userInfo.email) {
            tempData.push(<Results email={userInfo.email} data={element} image={item.uploads[index]} number={index} key={index} />)
          }
        })
        posts[1](tempData)
      })
    }
    const handleLogout = () => {
      setLoggedIn(false)
      setUserInfo({email: ""})
      posts[1]([])
    }
    if (loggedIn){
    return (
      <PostsContext.Provider value={posts}>
      <div className="page">
        <div className="nav">
          <h6>{userInfo.email}</h6>
          <img className="logo" alt="logo" src={logo}></img>
          <button onClick={handleLogout}>Logout</button>
        </div>

        <div className="centering">
          <form onSubmit={handleSubmit} className="formClass">
            <label for="CustomerName">Name:</label>
            <input type="text" id="CustomerName" className="inputField" onChange={handleName} />

            <label for="item">Item:</label>
            <input type="text" id="item" className="inputField" onChange={handleItem} />

            <label for="image">Image:</label>
            <input className="browse" type="file" id="image"  onChange={handleImage} />

            <label for="phnNum">Phone Number:</label>
            <input type="text" id="phnNum" className="inputField" onChange={handlePhone} />

            <label for="emailId">email:</label>
            <input type="email" id="emailId" className="inputField" onChange={handleEmail} />

            <button className="submit" type="submit" title="Click to submit form.">Submit</button>
          </form>
          <div>
            <div className="details">
              <button onClick={handlePosts} className="button-2">Show Your Posts</button>
            </div>
            <div className="main">              
              {posts[0]}
            </div>
          </div>
        </div>
      </div>
      </PostsContext.Provider>
    );
    }
  };

  function Results(props) {
    const [,setPosts]=useContext(PostsContext)
    const handlePosts = () => {
      fetch('/data')
      .then(item => item.json())
      .then(item => {
        let tempData=[]
        item.data.forEach((element,index)=> {
          if(element.logEmail===props.email) {
            tempData.push(<Results data={element} image={item.uploads[index]} number={index} key={index} />)
          }
        })
        setPosts(tempData)
      })
    }
    const handleClick = () => {
      fetch(`/delete?index=${props.number}`)
      .then(()=> handlePosts())
    }
    return (
      <div className="results">
        <img alt={props} src={`http://localhost:5000/${props.image}`} ></img>
        <div>
          <h6 className='item'>{props.data.item}</h6>
          <h6 className='name'>Supplier : {props.data.name}</h6>
          <h6 className='phone'>Phone no. {props.data.phone}</h6>
          <h6 className='email'>Email : {props.data.email}</h6>
          <button onClick={handleClick} className="remove">Remove</button>
        </div>
      </div>
    )
  }
  
  export default Form;