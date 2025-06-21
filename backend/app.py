from twilio.rest import Client


account_sid = 'ACff7c23863603fea66fcb9b52b5a09a7b'
auth_token = 'f4d7b356fff6c2ebfe819e429cc7fe75'


twilio_number = '+18565654145'  
your_number = '+919944851168'  

client = Client(account_sid, auth_token)

# Make the call
call = client.calls.create(
    to=your_number,
    from_=twilio_number,
    twiml='<Response><Say>Hello</Say></Response>'
)

print(f"Call initiated, SID: {call.sid}")
