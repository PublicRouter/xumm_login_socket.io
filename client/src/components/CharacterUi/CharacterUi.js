import React from 'react'
import "./characterUi.css"
export default function CharacterUi(props) {
    return (
        <div className="profile-page">
          <div className="profile-image">
            <img src={props.imageSrc} alt="character profile" />
          </div>
          <div className="item-slots">
            <div className="item-slot helmet">
              <img src={props.helmetSrc} alt="helmet" />
            </div>
            <div className="item-slot chest">
              <img src={props.chestSrc} alt="chest" />
            </div>
            <div className="item-slot legs">
              <img src={props.legsSrc} alt="legs" />
            </div>
            <div className="item-slot feet">
              <img src={props.feetSrc} alt="feet" />
            </div>
            <div className="item-slot weapon">
              <img src={props.weaponSrc} alt="weapon" />
            </div>
          </div>
        </div>
    );
}
