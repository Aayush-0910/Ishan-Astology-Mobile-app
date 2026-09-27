import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { sendEmail } from '../config/email';
import { SERVICE_FILTERS } from '../data/reviews';
import { colors, fonts } from '../theme';
import { Choice, EMAIL_RE, ErrorBanner, Field, Input, SuccessNotice } from './Form';
import { StarInput } from './Stars';
import { Button, Card } from './ui';

const SERVICES = SERVICE_FILTERS.filter((s) => s !== 'All');

const CONSENT_OPTIONS = [
  'Yes, you may use my name',
  'Yes, but initials only',
  'No, keep it private',
];

const EMPTY = {
  name: '',
  email: '',
  location: '',
  service: '',
  rating: 0,
  message: '',
  consent: CONSENT_OPTIONS[0],
};

export default function ReviewForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');

  const set = (key) => (val) => setValues((v) => ({ ...v, [key]: val }));

  const validate = () => {
    const e = {};
    if (values.name.trim().length < 2) e.name = 'Please enter your name.';
    if (!EMAIL_RE.test(values.email.trim())) e.email = 'Please enter a valid email address.';
    if (!values.service) e.service = 'Please choose which consultation you took.';
    if (!values.rating) e.rating = 'Please give a rating.';
    if (values.message.trim().length < 20) {
      e.message = 'Please write a sentence or two so it is useful to others.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async () => {
    if (status === 'sending') return;
    if (!validate()) return;

    setStatus('sending');
    try {
      await sendEmail({
        formType: 'review',
        subject: `New ${values.rating}★ Review from ${values.name.trim()}`,
        replyTo: values.email.trim(),
        fields: {
          Name: values.name.trim(),
          Email: values.email.trim(),
          Location: values.location.trim() || '—',
          Service: values.service,
          Rating: `${values.rating} out of 5`,
          Review: values.message.trim(),
          'Permission to publish': values.consent,
        },
      });
      setStatus('sent');
      setValues(EMPTY);
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <SuccessNotice title="Thank you" actionLabel="Write another" onAction={() => setStatus('idle')}>
        Your review has reached Ishan ji by email. Every review is read personally before anything
        is published, so it may be a few days before it appears.
      </SuccessNotice>
    );
  }

  return (
    <Card>
      <Field label="Name" error={errors.name}>
        <Input
          placeholder="Enter name"
          value={values.name}
          onChangeText={set('name')}
          autoComplete="name"
          textContentType="name"
        />
      </Field>

      <Field label="Email" error={errors.email}>
        <Input
          placeholder="Enter email"
          value={values.email}
          onChangeText={set('email')}
          autoComplete="email"
          textContentType="emailAddress"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </Field>

      <Field label="City / Country">
        <Input placeholder="Enter city or country" value={values.location} onChangeText={set('location')} />
      </Field>

      <Field label="Consultation" error={errors.service}>
        <Choice
          layout="chips"
          options={SERVICES}
          value={values.service}
          onChange={set('service')}
          accessibilityLabel="Consultation you took"
        />
      </Field>

      <Field label="Rating" error={errors.rating}>
        <StarInput value={values.rating} onChange={set('rating')} />
      </Field>

      <Field label="Review" error={errors.message}>
        <Input
          placeholder="Enter your review"
          value={values.message}
          onChangeText={set('message')}
          multiline
          numberOfLines={4}
        />
      </Field>

      <Field label="May we publish this?">
        <Choice options={CONSENT_OPTIONS} value={values.consent} onChange={set('consent')} />
      </Field>

      {status === 'error' ? <ErrorBanner>{errorMsg}</ErrorBanner> : null}
      {Object.keys(errors).length > 0 ? (
        <Text style={styles.fixHint}>Please fix the highlighted fields above.</Text>
      ) : null}

      <Button
        title={status === 'sending' ? 'Sending…' : 'Submit'}
        icon={status === 'sending' ? undefined : '→'}
        onPress={onSubmit}
        loading={status === 'sending'}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  fixHint: { fontFamily: fonts.serif, color: colors.error, fontSize: 13, marginBottom: 12 },
});
