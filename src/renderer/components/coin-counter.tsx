import { useSpring, animated } from '@react-spring/web'

interface Props {
  totalCoins: number
}

export const CoinCounter = ({ totalCoins }: Props): React.JSX.Element => {
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: totalCoins },
    config: { tension: 80, friction: 14, clamp: true }
  })

  return <animated.div>{number.to((n) => Math.floor(n))}</animated.div>
}
