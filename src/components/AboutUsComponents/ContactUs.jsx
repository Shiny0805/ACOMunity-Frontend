import React, { useState } from "react";
  
  export default function Contactus() {

    const [ name, setName ] = useState("");
    const [ email, setEmail ] = useState('');
    const [ message, setMessage ] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
    }

    return (
    <div class='w-3/4 m-auto rounded-sm border p-3'>
        <div class='text-4xl text-center p-10'>
            Contact Us
        </div>
        
        <div>
            <form>
                <div class='flex justify-between items-center'>
                    <div class='w-1/2 p-1 text-2xl'>
                        <label>First Name</label>
                        <input class='w-full rounded-lg p-1' placeholder="First Name" />
                    </div>

                    <div class='w-1/2 p-1 text-2xl'>
                        <label>Last Name</label>
                        <input class='w-full rounded-lg p-1' placeholder="Last Name" />
                    </div>
                </div>
                

            </form>
        </div>
    </div>
    );
  }
  