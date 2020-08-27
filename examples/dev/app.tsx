import React, {useState} from 'react'
import styled, {createGlobalStyle} from 'styled-components'
import {ConnectorsExample} from './examples/connectors'
import {ConnectorsHooksExample} from './examples/connectors-hooks'
import {DevExample} from './examples/dev'
import {ScrollExample} from './examples/scroll'

const DEFAULT_PATH = 'scroll'

const GlobalStyle = createGlobalStyle`
  html {
    font: 100%/1.25 -apple-system, BlinkMacSystemFont, sans-serif;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    margin: 0;
  }

  pre {
    font-family: Menlo;
  }
`

const Root = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  background: #222;
  color: #fff;
  padding: 1em;
`

const Content = styled.div`
  flex: 1;
  min-height: 0;
`

export function App() {
  const [path, setPath] = useState(DEFAULT_PATH)

  const handleOpenExample = (evt: React.MouseEvent<HTMLButtonElement>) => {
    setPath(evt.currentTarget.getAttribute('data-example') || DEFAULT_PATH)
  }

  return (
    <Root>
      <GlobalStyle />
      <Header>
        <button data-example="dev" disabled={path === 'dev'} onClick={handleOpenExample}>
          dev
        </button>
        <button
          data-example="connectors"
          disabled={path === 'connectors'}
          onClick={handleOpenExample}
        >
          connectors
        </button>
        <button
          data-example="connectors-hooks"
          disabled={path === 'connectors-hooks'}
          onClick={handleOpenExample}
        >
          connectors (hooks)
        </button>
        <button data-example="scroll" disabled={path === 'scroll'} onClick={handleOpenExample}>
          scroll
        </button>
      </Header>

      <Content>
        {path === 'connectors' && <ConnectorsExample />}
        {path === 'connectors-hooks' && <ConnectorsHooksExample />}
        {path === 'dev' && <DevExample />}
        {path === 'scroll' && <ScrollExample />}
      </Content>
    </Root>
  )
}
