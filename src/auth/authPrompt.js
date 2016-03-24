import prompt from 'prompt';

const defaultSchema = {
  properties: {
    username: {
      required: true
    },
    password: {
      hidden: true
    }
  }
};

function promisePrompt(schema) {
  return new Promise((resolve, reject) => {
    return prompt.get(schema, (err, result) => {
      if (err) {
        reject(err);
      }

      resolve(result);
    });
  });
}

export default function authPrompt(schema) {
  return promisePrompt(schema || defaultSchema);
}
