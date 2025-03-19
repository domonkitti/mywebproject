import axios from 'axios'
import { useEffect, useState } from 'react'

interface TeamScore {
  name: string
  score: number
}

export default function Moodeng() {
  const [click, setClick] = useState(0)
  const [isClick, setIsClick] = useState(false)

  const [team, setTeam] = useState('PEA')
  const [score, setScore] = useState<TeamScore[]>([])

  const popSound = new Audio('/src/assets/pop.mp3')

  const moodeng_close = 'https://img2.pic.in.th/pic/moodeng_close.md.png'
  const moodeng_open =
    'https://img5.pic.in.th/file/secure-sv1/moodeng_open.md.png'

  const apiUrl = 'https://moodeng-api.onrender.com/score'

  const handleDown = () => {
    setClick(click + 1)
    setIsClick(true)
    popSound.play()

    try {
      axios.get(apiUrl).then((data) => {
        setScore(data.data)
        console.log(score)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleUp = () => {
    setIsClick(false)
  }

  useEffect(() => {
    const clickCount = Number(localStorage.getItem('click'))
    if (clickCount > 0) {
      setClick(clickCount)
    }

    try {
      axios.get(apiUrl).then((data) => {
        setScore(data.data)
        console.log(score)
      })
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('click', click.toString())
    axios.post(apiUrl, { team })
  }, [click])

  const peaScore = score.find((s) => s.name === 'PEA')?.score || 0
  const oddScore = score.find((s) => s.name === 'ODD')?.score || 0

  return (
    <div className="flex flex-col w-full justify-center items-center gap-8">
      <h1 className="text-7xl font-bold">MOO-DENG POP</h1>
      <h2>PEA Score: {peaScore}</h2>
      <h2>ODD Score: {oddScore}</h2>
      <div className="flex gap-4 items-center">
        <p>Select Team:</p>
        <select
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          name="team selector"
          id="team"
        >
          <option value="PEA">PEA</option>
          <option value="ODD">ODD</option>
        </select>
      </div>
      <h2 className={`text-5xl ${isClick ? 'animate-spin' : ''}`}>{click}</h2>
      <img
        onMouseDown={handleDown}
        onMouseUp={handleUp}
        src={isClick ? moodeng_open : moodeng_close}
        alt="moodeng"
        className="w-[600px] drop-shadow-lg"
      />
    </div>
  )
}
