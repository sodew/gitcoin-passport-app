import { useState, useEffect } from 'react';

//component fetches passport score and displays it

//required props: scorer_id, headers, address

//optional props: label, hideLabel, hideInfo, style

//states: score, no score

//todo: design noScore state
//todo: add optional prop functionality

interface Props {
    SCORER_ID?: string;
    headers?: Record<string, string>;
    currentAddress?: string; 
  }
  
export const PassportScore = ({ SCORER_ID, headers, currentAddress}: Props) => {
    const [score, setScore] = useState<string>('')
    const [certainty, setCertainty] = useState<string>('')
    const [noScoreMessage, setNoScoreMessage] = useState<string>('') 
    
    useEffect(() => {
        if(SCORER_ID && headers && currentAddress) {
            fetchScore();
        }
    }, []);

    async function submitPassport() {
        setNoScoreMessage('')
        console.log(SCORER_ID)
        try {
          //const { message, nonce } = await getSigningMessage()
          //const signature = await signer.signMessage(message)
          
        //   const response = await fetch('https://api.scorer.gitcoin.co/registry/submit-passport', {
        //     method: 'POST',
        //     headers,
        //     body: JSON.stringify({
        //       address: currentAddress,
        //       scorer: SCORER_ID
        //     })
        //   })

        const body = JSON.stringify({
            address: currentAddress,
            community: "Deprecated",
            scorer_id: SCORER_ID,
            signature: '',
            nonce: ''
        });

        console.log('Body:', body);

        const response = await fetch('https://api.scorer.gitcoin.co/registry/submit-passport', {
            method: 'POST',
            headers,
            body
        })

          const data = await response.json()
          console.log('data:', data)
        } catch (err) {
          console.log('error: ', err)
        }
      };
    

    const fetchScore = async () => {
        await submitPassport();
        console.log('hi');
        const GET_PASSPORT_SCORE_URI = `https://api.scorer.gitcoin.co/registry/score/${SCORER_ID}/${currentAddress}`;

        try {
            const response = await fetch(GET_PASSPORT_SCORE_URI, {
                headers
            });

            const passportData = await response.json();
            console.log(passportData)

            if (passportData.score) {
                const roundedScore = Math.round(passportData.score * 100) / 100;
                setScore(roundedScore.toString());
                if (roundedScore <= 10) {
                    setCertainty('has barely any evidence that they are human')
                }
                else if (roundedScore <= 30) {
                    setCertainty('is probably a human')
                }
                else if (roundedScore <= 50) {
                    setCertainty('is most likely a human')
                }
                else if (roundedScore > 50) {
                    setCertainty('is definitely a human')
                }
            } else {
                setNoScoreMessage('No score available, please submit your passport after you have added some stamps.');
            }
        } catch (err) {
            console.log('error: ', err);
        }
    };
    // If SCORER_ID or headers or currentAddress is undefined, display a message
    if (!SCORER_ID || !headers || !currentAddress) {
        return (
        <div>
            <h1>SCORER_ID, headers or currentAddress is undefined!</h1>
        </div>
        )
    }

    if (noScoreMessage != '') {
        return (
            <div>
                <h2>{noScoreMessage}</h2>
            </div>
        )
    }

    const certaintyColor = certainty === 'has barely any evidence that they are human' ? 'red'
                          : certainty === 'is probably a human' ? 'orange'
                          : certainty === 'is most likely a human' ? 'green'
                          : 'blue';

    return (
    <div>
        <h2 style={styles.h2}><span style={{fontWeight: '600'}}>{currentAddress}</span> {certainty} </h2>
        <h2 style={styles.h2}> <span style={{...styles.h2, color: certaintyColor, fontWeight: '600'}}>{score}</span>/100 Unique Humanity Score</h2>
        <a style={styles.a} href={'https://docs.passport.gitcoin.co/overview/introducing-gitcoin-passport'}>See how score is calculated</a>
    </div>
    )
}

const styles = {
    h2: {
        fontSize: 20,
        fontWeight: 'normal',
        marginBottom: 10
    },
    a: {
        color: '#6F3FF5'
    }
}