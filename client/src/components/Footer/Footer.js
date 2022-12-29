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
        <em style={{marginBottom: isShown ? '1  vh' : "0px" , color:"white"}}>{isShown? "(click to minimize)" : "(click to enlarge)"}</em>
        <div id='footerSocials'  style={{display: isShown ? 'flex' : 'none'}}>
          <ul>
            {
              usersList.map((user) => 
                <li>
                  <div>
                    <em>socket: {user.socket}</em>
                    <em>Wallet: {user.wallet}</em>
                  </div>
                </li>
                // <li>
                //   <div>
                //     <em>socket: socket-121212121212</em>
                //     <em>Wallet: r1212121212121212121212</em>
                //   </div>
                // </li>
                
              
            )}
            {/* <li>
                  <div>
                    <em>socket: socket-121212121212</em>
                    <em>Wallet: r1212121212121212121212</em>
                  </div>
            </li>
            <li>
                  <div>
                    <em>socket: socket-121212121212</em>
                    <em>Wallet: r1212121212121212121212</em>
                  </div>
            </li>
            <li>
                  <div>
                    <em>socket: socket-121212121212</em>
                    <em>Wallet: r1212121212121212121212</em>
                  </div>
            </li>
            <li>
                  <div>
                    <em>socket: socket-121212121212</em>
                    <em>Wallet: r1212121212121212121212</em>
                  </div>
            </li>
            <li>
                  <div>
                    <em>socket: socket-121212121212</em>
                    <em>Wallet: r1212121212121212121212</em>
                  </div>
            </li>
            <li>
                  <div>
                    <em>socket: socket-121212121212</em>
                    <em>Wallet: r1212121212121212121212</em>
                  </div>
            </li>
            <li>
                  <div>
                    <em>socket: socket-121212121212</em>
                    <em>Wallet: r1212121212121212121212</em>
                  </div>
            </li>
            <li>
                  <div>
                    <em>socket: socket-121212121212</em>
                    <em>Wallet: r1212121212121212121212</em>
                  </div>
            </li>
            <li>
                  <div>
                    <em>socket: socket-121212121212</em>
                    <em>Wallet: r1212121212121212121212</em>
                  </div>
            </li>
            <li>
                  <div>
                    <em>socket: socket-121212121212</em>
                    <em>Wallet: r1212121212121212121212</em>
                  </div>
            </li>
            <li>
                  <div>
                    <em>socket: socket-121212121212</em>
                    <em>Wallet: r1212121212121212121212</em>
                  </div>
            </li>
            <li>
                  <div>
                    <em>socket: socket-121212121212</em>
                    <em>Wallet: r1212121212121212121212</em>
                  </div>
            </li>
            <li>
                  <div>
                    <em>socket: socket-121212121212</em>
                    <em>Wallet: r1212121212121212121212</em>
                  </div>
            </li>
            <li>
                  <div>
                    <em>socket: socket-121212121212</em>
                    <em>Wallet: r1212121212121212121212</em>
                  </div>
            </li>
            <li>
                  <div>
                    <em>socket: socket-121212121212</em>
                    <em>Wallet: r1212121212121212121212</em>
                  </div>
            </li>
            <li>
                  <div>
                    <em>socket: socket-121212121212</em>
                    <em>Wallet: r1212121212121212121212</em>
                  </div>
            </li> */}
          </ul> 
            
        </div>
        
    </button>
  )
}
