import React, {useState} from 'react'
import {
  IntersectionObserver,
  IntersectionObserverEntry,
  IntersectionObserverRegion,
  RectObserver,
  RectObserverEntry,
  RectObserverRegion,
  // useIntersectionObserver,
  // useRectObserver,
} from 'react-region-observer'
import styled from 'styled-components'

const Root = styled.div`
  display: flex;
  height: 100%;
`

const ScrollArea = styled.div`
  height: 100%;
  overflow: auto;
  flex: 1;
`

const RectArea = styled.div`
  position: relative;
  min-height: 100%;
  padding: 2em;
  box-sizing: border-box;
`

const RectRegion = styled(RectObserverRegion)<{payload: any}>`
  padding: 2em;
  margin: 1em 0;
`

const IntersectionArea = styled.div`
  position: relative;
  min-height: 100%;
  padding: 2em;
  box-sizing: border-box;
`

const IntersectionRegion = styled(IntersectionObserverRegion)<{payload: any}>`
  padding: 2em;
  margin: 1em 0;
`

export function DevExample() {
  const [leftEntries, setLeftEntries] = useState<RectObserverEntry<{id: string}>[]>([])
  const [rightEntries, setRightEntries] = useState<RectObserverEntry<{id: string}>[]>([])
  const [intersectionEntries, setIntersectionEntries] = useState<
    IntersectionObserverEntry<{id: string}>[]
  >([])

  return (
    <Root>
      <ScrollArea>
        <RectObserver onChange={setLeftEntries}>
          {(ref) => (
            <RectArea ref={ref}>
              <RectRegion payload={{id: 'a'}}>RectRegion</RectRegion>
              <RectRegion payload={{id: 'b'}}>RectRegion</RectRegion>
              <RectRegion payload={{id: 'c'}}>RectRegion</RectRegion>
              <RectRegion payload={{id: 'd'}}>RectRegion</RectRegion>
              <RectRegion payload={{id: 'e'}}>RectRegion</RectRegion>
              <RectRegion payload={{id: 'f'}}>RectRegion</RectRegion>
              <RectOverlay entries={leftEntries} />
            </RectArea>
          )}
        </RectObserver>
      </ScrollArea>

      <ScrollArea>
        <RectObserver onChange={setRightEntries}>
          {(ref) => (
            <RectArea ref={ref}>
              <RectRegion payload={{id: 'a'}}>RectRegion</RectRegion>
              <RectRegion payload={{id: 'b'}}>RectRegion</RectRegion>
              <RectRegion payload={{id: 'c'}}>RectRegion</RectRegion>
              <RectRegion payload={{id: 'd'}}>RectRegion</RectRegion>
              <RectRegion payload={{id: 'e'}}>RectRegion</RectRegion>
              <RectRegion payload={{id: 'f'}}>RectRegion</RectRegion>
              <RectRegion payload={{id: 'g'}}>RectRegion</RectRegion>
              <RectRegion payload={{id: 'h'}}>RectRegion</RectRegion>
              <RectRegion payload={{id: 'i'}}>RectRegion</RectRegion>
              <RectOverlay entries={rightEntries} />
            </RectArea>
          )}
        </RectObserver>
      </ScrollArea>

      <IntersectionObserver onChange={setIntersectionEntries}>
        {(ref) => (
          <ScrollArea ref={ref}>
            <IntersectionArea>
              <IntersectionRegion payload={{id: 'a'}}>a</IntersectionRegion>
              <IntersectionRegion payload={{id: 'b'}}>b</IntersectionRegion>
              <IntersectionRegion payload={{id: 'c'}}>c</IntersectionRegion>
              <IntersectionRegion payload={{id: 'd'}}>d</IntersectionRegion>
              <IntersectionOverlay entries={intersectionEntries} />
            </IntersectionArea>
          </ScrollArea>
        )}
      </IntersectionObserver>
    </Root>
  )
}

const RectOverlayRoot = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 255, 0.1);
`

const RectOverlayRegion = styled.div`
  position: absolute;
  background: rgba(0, 0, 255, 0.5);
  outline: 1px solid #00f;
  outline-offset: -1px;
  color: #fff;
  text-align: right;
`

function RectOverlay({entries}: {entries: RectObserverEntry<{id: string}>[]}) {
  // const {entries} = useRectObserver<{id: string}>()

  return (
    <RectOverlayRoot>
      {entries.map(({payload, rect}) => (
        <RectOverlayRegion key={payload.id} style={rect}>
          {payload.id}
        </RectOverlayRegion>
      ))}
    </RectOverlayRoot>
  )
}

const IntersectionOverlayRoot = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 0, 0, 0.1);
`

const IntersectionOverlayRegion = styled.div`
  /* position: absolute; */
  background: rgba(255, 0, 0, 0.5);
  outline: 1px solid #f00;
  outline-offset: -1px;
  color: #fff;
`

function IntersectionOverlay({entries}: {entries: IntersectionObserverEntry<{id: string}>[]}) {
  // const {} = useIntersectionObserver<{id: string}>()

  return (
    <IntersectionOverlayRoot>
      {entries.map(({intersection, payload}) => (
        <IntersectionOverlayRegion key={payload.id}>
          <pre>
            {payload.id} {JSON.stringify(intersection, null, 2)}
          </pre>
        </IntersectionOverlayRegion>
      ))}
    </IntersectionOverlayRoot>
  )
}
