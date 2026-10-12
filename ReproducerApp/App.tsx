/**
 * Repro: on Android (RN 0.87.1), `textDecorationLine: 'underline'` disappears
 * from Text views whose own props and position did not change, once a sibling
 * is inserted after them.
 *
 * 1. Launch: every row is underlined.
 * 2. Tap INSERT: the `n` rows (above the insertion, unchanged) lose their
 *    underline. The inserted `k` rows and the shifted `s` rows keep it.
 *
 * RERENDER (parent state only) and REMOUNT (key change) do not trigger it.
 *
 * @format
 */

import { useState } from 'react';
import { Button, ScrollView, Text, View } from 'react-native';

const BASE = { fontSize: 13, lineHeight: 20, color: '#333' } as const;
const UNDERLINE = { textDecorationLine: 'underline' } as const;
const ROWS = Array.from({ length: 8 }, (_, i) => i + 1);

function Rows({ inserted }: { inserted: boolean }) {
  return (
    <>
      {ROWS.map(i => (
        <Text key={`n${i}`} style={BASE}>
          n{i} nested: before <Text style={UNDERLINE}>underlined</Text> after
        </Text>
      ))}
      {inserted &&
        ROWS.map(i => (
          <Text key={`k${i}`} style={BASE}>
            k{i} inserted: before <Text style={UNDERLINE}>underlined</Text>{' '}
            after
          </Text>
        ))}
      {ROWS.map(i => (
        <Text key={`s${i}`} style={[BASE, UNDERLINE]}>
          s{i} standalone underlined
        </Text>
      ))}
    </>
  );
}

function App() {
  const [renders, setRenders] = useState(0);
  const [mountKey, setMountKey] = useState(0);
  const [inserted, setInserted] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View
        style={{ flexDirection: 'row', gap: 8, padding: 16, paddingTop: 48 }}
      >
        <Button
          title={`rerender (${renders})`}
          onPress={() => setRenders(n => n + 1)}
        />
        <Button
          title={`remount (${mountKey})`}
          onPress={() => setMountKey(n => n + 1)}
        />
        <Button
          title={inserted ? 'remove' : 'insert'}
          onPress={() => setInserted(v => !v)}
        />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Rows key={mountKey} inserted={inserted} />
      </ScrollView>
    </View>
  );
}

export default App;
