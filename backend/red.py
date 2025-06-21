import requests  
  
url = "https://api.sarvam.ai/translate"  
headers = {  
    "api-subscription-key": "3eb1b62e-2cd8-410b-9004-52cd0403bb02",  # Replace with actual key  
    "Content-Type": "application/json"  
}  
  
payload = {  
    "input": "foo",  
    "source_language_code": "auto",  # Auto-detect source language  
    "target_language_code": "bn-IN"  # Bengali (India)  
}  
  
response = requests.post(url, json=payload, headers=headers)
response.raise_for_status()  # Raise exception for HTTP errors
result = response.json()
print("Translation successful!")  
print(f"Input: {payload['input']}")  
print(f"Translated to {payload['target_language_code']}: {result.get('translated_text', 'No translation found')}")