import { Flex, Text, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import KeyIcon from "./KeyButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useNuiEvent } from "../../hooks/useNuiEvent";
import colorWithAlpha from "../../utils/colorWithAlpha";

type KeyInputProps = {
  key: string
  label: string
  icon: string
  delay?: number
  pressed?: boolean
}

type PositionProps = 'top-right' | 'middle-right' | 'bottom-right' | 'top-left' | 'middle-left' | 'bottom-left' | 'middle-bottom' | 'middle-top' | {
  top?: string | number
  right?: string | number
  bottom?: string | number
  left?: string | number
  transform?: string
}
export default function KeyInputs(){
  const [position, setPosition] = useState<PositionProps>('middle-bottom')
  const [pressedKeys, setPressedKeys] = useState<string[]>([])
  const [keyInputs, setKeyInputs] = useState<KeyInputProps[]>([
    { key: 'F1', label: 'Open Menu', icon: 'fa fa-bars', delay: 1000 },
    { key: 'F2', label: 'Open Inventoryasdasdsadasdasdasddsasdasdsaasdasdsddasdasddsdsad', icon: 'fa fa-box' },
  ])

  useNuiEvent('SET_KEY_INPUTS', (data: {
    position: PositionProps
    inputs: KeyInputProps[]
  }) => {
    setPosition(data.position)
    setKeyInputs(data.inputs) 
  })

  


  // listen for keys pressed and release and set the pressed state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      if (!pressedKeys.includes(e.key)) {
        setPressedKeys([...pressedKeys, e.key])
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      e.preventDefault()
      setPressedKeys(pressedKeys.filter(key => key !== e.key))
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [keyInputs])

  const getPositionProps = (position : PositionProps) => {

    if (typeof position !== 'string') {
      return {
        top: position.top,
        right: position.right,
        bottom: position.bottom,
        left: position.left
      }
    }

    switch (position) {
      case 'top-right':
        return {
          top: 0,
          right: 0
        }
      case 'middle-right':
        return {
          top: '50%',
          right: 0, 
        
        }
      case 'bottom-right':
        return {
          bottom: 0,
          right: 0
        }
      case 'top-left':
        return {
          top: 0,
          left: 0
        }
      case 'middle-left':
        return {
          top: '50%',
          left: 0
        }
      case 'bottom-left':
        return {
          bottom: 0,
          left: 0
        }
      case 'middle-bottom':
        return {
          bottom: 0,
          left: '50%'
        }
      case 'middle-top':
        return {
          top: 0,
          left: '50%'
        }
    }
  }



  const getTranslate = (position: PositionProps) => {
    if (typeof position !== 'string') {
      return position.transform
    }

    switch (position) {
      case 'top-right':
        return 'translate(0, 0)'
      case 'middle-right':
        return 'translate(0, -50%)'
      case 'bottom-right':
        return 'translate(0, 0)'
      case 'top-left':
        return 'translate(0, 0)'
      case 'middle-left':
        return 'translate(0, -50%)'
      case 'bottom-left':
        return 'translate(0, 0)'
      case 'middle-bottom':
        return 'translate(-50%, 0)'
      case 'middle-top':
        return 'translate(-50%, 0)'
    }
  }

  return (
    <Flex
      pos='absolute'
      gap='xs'
      p='xs'
     
      {...getPositionProps(position)}
      style={{
        transform: getTranslate(position)
      }}
      direction={'column'}
    
      justify={'center'}
    >
      {keyInputs.map((keyInput, index) => (
        <Flex 
  
          key={index}
          gap='xs'
          align={'center'}
          
        >
          <KeyIcon _key={keyInput.key} pressed={pressedKeys.includes(keyInput.key)} />
          <KeyLabel {...keyInput} pressed={pressedKeys.includes(keyInput.key)} />
          
        </Flex>
      ))}

    </Flex>
  )
}

export function KeyLabel(props: KeyInputProps) {
  const theme = useMantineTheme();
  const [progress, setProgress] = useState(0);


  // while the key is pressed, increase the progress bar until 100% (time is props.delay (seconds))
  useEffect(() => {

    if (props.pressed && !props.delay) {
      console.log('instant release')
      setProgress(100)
      return  
    }

    if (props.pressed && props.delay) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            console.log('natural release')
            clearInterval(interval)
            return 0
          }
          return prev + 1
        })
      }, props.delay ? props.delay / 100 : 10)
      return () => clearInterval(interval)
    } else {
      setProgress(0)
    }
  }, [props.pressed]) 

  return (
    <Flex
      align="center"
      gap="xs"
      pos="relative" // Enable absolute positioning for the progress bar
      p="xs"
      style={{
        borderRadius: theme.radius.xs,
        overflow: "hidden", // Prevent overflow for the progress bar
        backgroundColor: "rgba(0,0,0,0.5)", // Background for the container
      
      
      }}
    >
      {/* Progress Bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: !props.delay ? '100%' : `${progress}%`, // Set the width to the progress
          background: !props.delay ? props.pressed ? 
            colorWithAlpha(theme.colors[theme.primaryColor][theme.primaryShade as number], 0.05) : 'transparent' : 
            'transparent',
            boxShadow: props.pressed ? `inset 0 0 2.9vh ${colorWithAlpha(
              theme.colors[theme.primaryColor][theme.primaryShade as number],
              0.8
            )}` : 'none',

          zIndex: 0, // Behind the text and icon
          transition: !props.delay ? 'all ease-in-out 0.2s' : 'none',
          
        }}
      />
      {/* Icon and Label */}
      <FontAwesomeIcon
        icon={props.icon as IconProp}
        style={{ zIndex: 1 }} // Ensure the icon is above the progress bar
      />
      <Text size="1.8vh" style={{ zIndex: 1 }}> {/* Ensure text is above the progress bar */}
        {props.label}
      </Text>
    </Flex>
  );
}