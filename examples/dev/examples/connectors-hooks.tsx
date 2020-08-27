import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {
  createRectObserver,
  RectObserverContext,
  RectObserverEntry,
  RectObserverRegion,
} from 'react-region-observer'

function useRectObserver() {
  const {observe, setRootElement, subscribe, unobserve} = useMemo(() => createRectObserver(), [])
  const [entries, setEntries] = useState<RectObserverEntry[]>([])

  useEffect(() => subscribe(setEntries), [subscribe])

  const Region = useCallback(({children, payload}) => {
    return (
      <RectObserverContext.Provider
        value={{
          // entries,
          observe,
          unobserve,
        }}
      >
        <RectObserverRegion payload={payload}>{children}</RectObserverRegion>
      </RectObserverContext.Provider>
    )
  }, [])

  return {entries, ref: setRootElement, Region}
}

export function ConnectorsHooksExample() {
  const {entries, ref, Region} = useRectObserver()

  console.log(entries)

  return (
    <div ref={ref}>
      <Region payload={{name: 'a'}}>a</Region>
      <Region payload={{name: 'b'}}>b</Region>
      <pre>{JSON.stringify(entries, null, 2)}</pre>
    </div>
  )
}
