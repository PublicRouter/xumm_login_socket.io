import React, {useState} from 'react';
import '../Footer/footer.css';

export default function Footer({socket}) {
  const [isShown, setIsShown] = useState(true);
  const [usersList, updateUsersList] = useState([])
  // const [userList]
  socket.on("loggedInUsers", (users) => {
    updateUsersList(users);
  })


  const handleClick = event => {
    // 👇️ toggle visibility
    setIsShown(current => !current);
  };

  return (
    <button id='footerDiv'  onClick={handleClick}>
        <em id='publisherName'>Online Users</em>
        <em>{isShown? "(click to minimize)" : "(click to enlarge)"}</em>
        <div id='footerSocials'  style={{display: isShown ? 'flex' : 'none'}}>
          <ul>
            {
              usersList.map((user) => 
                <li>{user}</li>
              
            )}
          </ul>
            
        </div>
        
    </button>
  )
}
