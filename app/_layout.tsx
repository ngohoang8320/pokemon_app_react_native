import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center'
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          title: 'Details',
          presentation: 'formSheet',
          sheetAllowedDetents: [0.5, 0.7],
          sheetInitialDetentIndex: 0,
          sheetCornerRadius: 20,
          sheetGrabberVisible: true,
          headerBackButtonDisplayMode: 'minimal'
        }}
      />
    </Stack>
  );
}
