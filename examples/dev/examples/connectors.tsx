import React, {useCallback, useState} from 'react'
import {Rect, RectObserver, RectObserverEntry, RectObserverRegion} from 'react-region-observer'
import styled from 'styled-components'

const Root = styled.div`
  height: 100%;
  position: relative;
  background: #ddd;
`

const PaneContainer = styled.div`
  display: flex;
  height: 100%;

  & > div {
    flex: 1;
    min-width: 0;
  }

  & > div + div {
    margin-left: 1px;
  }
`

const Pane = styled.div`
  padding: 2em;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  overflow: auto;
`

const FieldContainer = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: min-content;
  grid-gap: 1em;
`

const FieldRoot = styled.div`
  padding: 1em;
  /* background: #eee; */
  min-height: 20em;
`

function Field(props: {name: string}) {
  return (
    <RectObserverRegion payload={{name: props.name}}>
      <FieldRoot>{props.name}</FieldRoot>
    </RectObserverRegion>
  )
}

interface OverlayProps {
  left: {
    rect: Rect
    entries: RectObserverEntry<{name: string}>[]
    scrollTop: number
  }
  right: {
    rect: Rect
    entries: RectObserverEntry<{name: string}>[]
    scrollTop: number
  }
}

function buildOverlayProps(params: {
  paneRectEntries: RectObserverEntry[]
  leftRectEntries: RectObserverEntry<{name: string}>[]
  rightRectEntries: RectObserverEntry<{name: string}>[]
  leftScrollTop: number
  rightScrollTop: number
}): OverlayProps | null {
  if (params.paneRectEntries.length !== 2) {
    return null
  }

  const [{rect: leftContainerRect}, {rect: rightContainerRect}] = params.paneRectEntries

  const rightEntries = params.rightRectEntries.map(({payload, rect}) => {
    return {
      payload,
      rect: {
        ...rect,
        top: rect.top + rightContainerRect.top,
        right: rect.right + rightContainerRect.right,
        bottom: rect.bottom + rightContainerRect.bottom,
        left: rect.left + rightContainerRect.left,
      },
    }
  })

  return {
    left: {
      rect: leftContainerRect,
      entries: params.leftRectEntries,
      scrollTop: params.leftScrollTop,
    },
    right: {
      rect: rightContainerRect,
      entries: rightEntries,
      scrollTop: params.rightScrollTop,
    },
  }
}

export function ConnectorsExample() {
  const [paneRectEntries, setPaneRectEntries] = useState<RectObserverEntry[]>([])
  const [leftRectEntries, setLeftRectEntries] = useState<RectObserverEntry<{name: string}>[]>([])
  const [rightRectEntries, setRightRectEntries] = useState<RectObserverEntry<{name: string}>[]>([])
  const [leftScrollTop, setLeftScrollTop] = useState(0)
  const [rightScrollTop, setRightScrollTop] = useState(0)

  const handleLeftScroll = useCallback((evt: React.UIEvent<HTMLDivElement>) => {
    setLeftScrollTop(evt.currentTarget.scrollTop)
  }, [])

  const handleRightScroll = useCallback((evt: React.UIEvent<HTMLDivElement>) => {
    setRightScrollTop(evt.currentTarget.scrollTop)
  }, [])

  const overlayProps = buildOverlayProps({
    paneRectEntries,
    leftRectEntries,
    rightRectEntries,
    leftScrollTop,
    rightScrollTop,
  })

  return (
    <Root>
      <RectObserver onChange={setPaneRectEntries}>
        {(ref) => (
          <PaneContainer ref={ref}>
            <RectObserverRegion>
              <RectObserver onChange={setLeftRectEntries}>
                {(ref) => (
                  <Pane onScroll={handleLeftScroll} ref={ref}>
                    <FieldContainer>
                      <Field name="foo" />
                      <Field name="bar" />
                      <Field name="baz" />
                      <Field name="qux" />
                    </FieldContainer>
                  </Pane>
                )}
              </RectObserver>
            </RectObserverRegion>
            <RectObserverRegion>
              <RectObserver onChange={setRightRectEntries}>
                {(ref) => (
                  <Pane onScroll={handleRightScroll} ref={ref}>
                    <FieldContainer>
                      <Field name="foo" />
                      <Field name="bar" />
                    </FieldContainer>
                  </Pane>
                )}
              </RectObserver>
            </RectObserverRegion>
          </PaneContainer>
        )}
      </RectObserver>

      {overlayProps && <Overlay {...overlayProps} />}
    </Root>
  )
}

const OverlayRoot = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* opacity: 0.2; */
  pointer-events: none;
  overflow: hidden;
`

const OverlayRegion = styled.div`
  position: absolute;
  /* background: rgba(255, 0, 0, 0.2); */
  text-align: right;
  padding: 1em;
  box-sizing: border-box;
  outline: 1px solid #ccc;
`

const ConnectorsSVG = styled.svg`
  display: block;
  position: absolute;
  top: 0;
  left: calc(50% - 33px);
  width: calc(65px);
  height: 100%;
  /* background: rgba(0, 0, 0, 0.3); */

  & path {
    stroke: #ccc;
    stroke-width: 2px;
  }
`

function Overlay({left, right}: OverlayProps) {
  const leftEntryMap = left.entries.reduce(
    (acc: {[name: string]: RectObserverEntry<{name: string}>}, x) => {
      acc[x.payload.name] = x
      return acc
    },
    {}
  )

  const entries = right.entries
    .map((entry) => {
      const leftEntry = leftEntryMap[entry.payload.name]

      if (!leftEntry) return null

      return {
        name: entry.payload.name,
        left: leftEntry.rect,
        right: entry.rect,
      }
    })
    .filter(Boolean)

  return (
    <OverlayRoot>
      <>
        {left.entries.map(({payload, rect}) => (
          <OverlayRegion key={payload.name} style={{...rect, top: rect.top - left.scrollTop}}>
            {payload.name}
          </OverlayRegion>
        ))}
      </>

      <>
        {right.entries.map(({payload, rect}) => (
          <OverlayRegion key={payload.name} style={{...rect, top: rect.top - right.scrollTop}}>
            {payload.name}
          </OverlayRegion>
        ))}
      </>

      <ConnectorsSVG>
        {entries.map(({name, left: l, right: r}: any) => (
          <path
            d={`M0 ${l.top - left.scrollTop + 8} L65 ${r.top - right.scrollTop + 8} Z`}
            key={name}
          />
        ))}
      </ConnectorsSVG>
    </OverlayRoot>
  )
}
