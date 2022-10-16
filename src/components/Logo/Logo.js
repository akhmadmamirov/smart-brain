import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css'
const Logo = () => {
    return (
       <div classname='ma4 mt0'>
         <Tilt className='Tilt br2 ml4 shadow-2' options={{max : 55}} style={{ height: '150px', width: '150px', }}>
            <div className='Tilt-inner pa3'>
                <img style={{paddingTop: '5px'}} src={brain} alt='logo' height={100} width={100}/>
            </div>
        </Tilt>
       </div>
    );
}
export  default Logo;
