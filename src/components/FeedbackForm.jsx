import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { sendEmail } from '../config/email';
import { colors, fonts } from '../theme';
import { EMAIL_RE, ErrorBanner, Field, Input, SuccessNotice } from './Form';
import { Button, Card } from './ui';

const EMPTY = { name: '', email: '', subject: '', message: '' };

export default function FeedbackForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');

  const set = (key) => (val) => setValues((v) => ({ ...v, [key]: val }));

  const validate = () => {
    const e = {};
    if (values.name.trim().length < 2) e.name = 'Please enter your name.';
    if (!EMAIL_RE.test(values.email.trim())) e.email = 'Please enter a valid email address.';
    if (values.subject.trim().length < 3) e.subject = 'Please enter a subject.';
    if (values.message.trim().length < 10) e.message = 'Please tell us a little more.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async () => {
    if (status === 'sending') return;
    if (!validate()) return;

    setStatus('sending');
    try {
      await sendEmail({
        formType: 'feedback',
        subject: `Website Feedback: ${values.subject.trim()}`,
        replyTo: values.email.trim(),
        fields: {
          Name: values.name.trim(),
          Email: values.email.trim(),
          Subject: values.subject.trim(),
          Message: values.message.trim(),
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
      <SuccessNotice title="Message sent" actionLabel="Send another" onAction={() => setStatus('idle')}>
        Thank you — your message has reached Ishan ji by email. If you asked for a reply, it will
        come to the address you gave.
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

      <Field label="Subject" error={errors.subject}>
        <Input placeholder="Enter subject" value={values.subject} onChangeText={set('subject')} />
      </Field>

      <Field label="Message" error={errors.message}>
        <Input
          placeholder="Enter message"
          value={values.message}
          onChangeText={set('message')}
          multiline
          numberOfLines={4}
        />
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
