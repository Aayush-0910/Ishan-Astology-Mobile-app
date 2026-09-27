import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import DateTimeField from '../components/DateTimeField';
import { Field, Input } from '../components/Form';
import { Button, P, Screen } from '../components/ui';
import { useAppStore } from '../state/AppStore';
import { success } from '../utils/haptics';
import { colors } from '../theme';

export default function ProfileEditScreen() {
  const { profile, saveProfile } = useAppStore();
  const [name, setName] = useState(profile?.name ?? '');
  const [dob, setDob] = useState(profile?.dob ?? '');
  const [tob, setTob] = useState(profile?.tob ?? '');
  const [pob, setPob] = useState(profile?.pob ?? '');

  const save = () => {
    saveProfile({ name: name.trim(), dob, tob, pob: pob.trim() });
    success();
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Screen
        footer={<Button title="Save" icon="checkmark" onPress={save} disabled={name.trim().length < 2} style={{ flex: 1 }} />}
      >
        <P muted>
          Stored only on this phone and used to fill in your bookings. Add the details of whoever
          most of your readings are for.
        </P>
        <Field label="Full name">
          <Input value={name} onChangeText={setName} placeholder="Your full name" autoComplete="name" textContentType="name" />
        </Field>
        <Field label="Date of birth">
          <DateTimeField mode="date" value={dob} onChange={setDob} placeholder="Select date" />
        </Field>
        <Field label="Time of birth">
          <DateTimeField mode="time" value={tob} onChange={setTob} placeholder="Select time" />
        </Field>
        <Field label="Place of birth">
          <Input value={pob} onChangeText={setPob} placeholder="City, State, Country" />
        </Field>
      </Screen>
    </KeyboardAvoidingView>
  );
}
