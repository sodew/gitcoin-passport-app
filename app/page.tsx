// import the necessary packages
'use client'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { CheckScore } from '../components/CheckScore'
import { SecretMessage } from '../components/SecretMessage'
//import { DisplayStamps } from '@/components/DisplayStamps'
import { Stint_Ultra_Condensed } from 'next/font/google'
import { PassportScore } from '../components/PassportScore'

import { DisplayStamps } from 'passport-quick-start'

// these lines read the API key and scorer ID from your .env.local file
const APIKEY = process.env.NEXT_PUBLIC_GC_API_KEY
const SCORER_ID = process.env.NEXT_PUBLIC_GC_SCORER_ID

// endpoint for submitting passport
const SUBMIT_PASSPORT_URI = 'https://api.scorer.gitcoin.co/registry/submit-passport'
// endpoint for getting the signing message
const SIGNING_MESSAGE_URI = 'https://api.scorer.gitcoin.co/registry/signing-message'
// score needed to see hidden message
const THRESHOLD_NUMBER = 20

// these lines add the corretc header information to the request
const headers = APIKEY ? ({
  'Content-Type': 'application/json',
  'X-API-Key': APIKEY
}) : undefined

// enable wallet interactions
declare global {
  interface Window{
    ethereum?: any
  }
}

export default function Passport() {
  // here we deal with any local state we need to manage
  const [address, setAddress] = useState<string>('')
  const [connected, setConnected] = useState<boolean>(false)
  const [score, setScore] = useState<string>('')
  const [noScoreMessage, setNoScoreMessage] = useState<string>('')
  //const [userAddress, setUserAddress] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    console.log(address);
  };

  const submitWallet = () => {
    if(address){
      setConnected(true);
    }
    console.log(address);
  }

  return (
    /* this is the UI for the app */
    <div style={styles.main}>
      <h1 style={styles.heading}>Are they human? 👀</h1>
      <h3 style={styles.h3}>Input a wallet address and we'll tell you how uniquely human that address is... or if it's a bot!</h3>

      <div style={styles.buttonContainer}>
      {
        !connected && (
          <div style={styles.walletContainer}>
            <label style={{fontWeight: '600'}}>Wallet address: </label>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <input style={styles.input} type="text" placeholder='ex: 0x47...ek63' value={address} onChange={handleChange}/>
              <button style={styles.buttonStyle} onClick={submitWallet}>Submit Wallet</button>
            </div>
          </div>
        )
      }
      {
        connected && (
          <div>
            <div style={styles.componentContainer}>
              <h2 style={styles.h2}>Humanity Score Checker:</h2>
              <PassportScore SCORER_ID={SCORER_ID} headers={headers} currentAddress={address} />
            </div>
            
            <div style={styles.componentContainer}>
              <h2 style={{...styles.h2, marginBottom: 0}}>Identity Validation Stamps:</h2>
              <a style={styles.a} href={'https://docs.passport.gitcoin.co/overview/introducing-gitcoin-passport'}>What are stamps?</a>
              <DisplayStamps headers={headers} currentAddress={address}/>
              {/* <PassportGate SCORER_ID={SCORER_ID} headers={headers} currentAddress={address} threshold={15}/> */}
            </div>
          </div>
        )
      }
      </div>
    </div>


  )
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    width: '900px',
    margin: '0 auto',
    paddingTop: 90,
    backgroundColor: '#ffffff'
  },
  heading: {
    fontSize: 56,
    margin: 0
  },
  intro: {
    fontSize: 18,
    //color: 'rgba(0, 0, 0, .2)'
  },
  a: {
    color: '#6F3FF5'
  },
  h2: {
    fontSize: 24,
    fontWeight: '500'
  },
  h3: {
    fontWeight: '400'
  },
  walletContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    width: '75%',
    padding: '10px',
    marginTop: '8px',
    backgroundColor: '#F7F8F9',
    border: 'solid #E7E8EB',
    borderRadius: '3px'
  },
  configurePassport: {
    marginTop: 20,
  },
  linkStyle: {
    color: '#008aff'
  },
  buttonContainer: {
    marginTop: 50
  },
  buttonStyle: {
    padding: '12px 40px',
    outline: 'none',
    border: 'none',
    cursor: 'pointer',
    marginTop: '10px',
    marginLeft: '10px',
    background: "#6935FF",
    borderRadius: "4px",
    color: "#ffffff"

    //borderBottom: '2px solid rgba(0, 0, 0, .2)',
    //borderRight: '2px solid rgba(0, 0, 0, .2)'
  },
  componentContainer: {
    marginTop: 15
  },
  noScoreMessage: {
    marginTop: 20
  }
}