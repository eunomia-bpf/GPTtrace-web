import { APIKeyInput } from '@/components/APIKeyInput';
import { CodeBlock } from '@/components/CodeBlock';
import { LanguageSelect } from '@/components/LanguageSelect';
import {preview_input_code, preview_output_code} from "@/components/ScriptTemplate"
import { ModelSelect } from '@/components/ModelSelect';
import { TextBlock } from '@/components/TextBlock';
import { OpenAIModel, TranslateBody } from '@/types/types';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Home() {
  const start = "This is the start";
  const end = "This is the end";
  const [inputLanguage, setInputLanguage] = useState<string>('Help Doc');
  const [outputLanguage, setOutputLanguage] = useState<string>('Bash');
  const [inputCode, setInputCode] = useState<string>(preview_input_code);
  const [outputCode, setOutputCode] = useState<string>(preview_output_code);
  const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasTranslated, setHasTranslated] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');

  const handleTranslate = async () => {
    const maxCodeLength = model === 'gpt-3.5-turbo' ? 6000 : 12000;

    if (!apiKey) {
      alert('Please enter an API key.');
      return;
    }

    if (inputLanguage === outputLanguage) {
      alert('Please select different languages.');
      return;
    }

    if (!inputCode) {
      alert('Please enter some code.');
      return;
    }

    if (inputCode.length > maxCodeLength) {
      alert(
        `Please enter code less than ${maxCodeLength} characters. You are currently at ${inputCode.length} characters.`,
      );
      return;
    }

    setLoading(true);
    setOutputCode('');

    const controller = new AbortController();
    const help_doc = inputCode;
    const language = outputLanguage;
    const body: TranslateBody = {
      help_doc,
      language,
      model,
      apiKey,
    };

    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setLoading(false);
      alert('Something went wrong.');
      return;
    }

    const data = response.body;

    if (!data) {
      setLoading(false);
      alert('Something went wrong.');
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let code = '';

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      code += chunkValue;

      setOutputCode((prevCode) => prevCode + chunkValue);
    }

    setLoading(false);
    setHasTranslated(true);
    copyToClipboard(code);
  };

  const copyToClipboard = (text: string) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);

    localStorage.setItem('apiKey', value);
  };

  useEffect(() => {
    if (hasTranslated) {
      handleTranslate();
    }
  }, [outputLanguage]);

  useEffect(() => {
    const apiKey = localStorage.getItem('apiKey');

    if (apiKey) {
      setApiKey(apiKey);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Code Generate</title>
        <meta
          name="description"
          content="Use AI to translate code from one language to another."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-full min-h-screen flex-col items-center bg-[#0E1117] px-4 pb-20 text-neutral-200 sm:px-10">
        <div className="mt-2 flex flex-col items-center justify-center sm:mt-8">
          <div className="text-4xl font-bold">Bpftrace Program Generate</div>
        </div>

        <div className="mt-0 flex flex-col items-center justify-center sm:mt-5">
          <div className="mt-0 text-center text-sm">
            <b>Your one-click solution to transforming natural language into a bpftrace program!</b> <br></br>
            <u>Paste the generated bpftrace code after "sudo bpftrace" to run it. For multi-line programs, you can save it as a `bpftrace.bt` file.</u>
          </div>
        </div>

        <div className="mt-6 text-center text-sm">
          <APIKeyInput apiKey={apiKey} onChange={handleApiKeyChange} />
        </div>

        <div className="mt-2 flex items-center space-x-2">
          <ModelSelect model={model} onChange={(value) => setModel(value)} />

          <button
            className="w-[140px] cursor-pointer rounded-md bg-violet-500 px-4 py-2 font-bold hover:bg-violet-600 active:bg-violet-700"
            onClick={() => handleTranslate()}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>

        <div className="mt-2 text-center text-xs">
          {loading
            ? 'Generating...'
            : hasTranslated
            ? 'Output copied to clipboard!'
            : 'Enter the description of the program and click "Generate"'}
        </div>

        <div className="mt-6 flex w-full max-w-[1200px] flex-col justify-between sm:flex-row sm:space-x-4">
          <div className="h-100 flex flex-col justify-center space-y-2 sm:w-2/4">
            {/* <div className="text-center text-xl font-bold">Input</div> */}

            <div className="w-full rounded-md bg-[#1F2937] px-4 py-2 text-neutral-200" align='center'>
              Program Description
            </div>

            {inputLanguage === 'Natural Language' ? (
              <TextBlock
                text={inputCode}
                editable={!loading}
                onChange={(value) => {
                  setInputCode(value);
                  setHasTranslated(false);
                }}
              />
            ) : (
              <CodeBlock
                code={inputCode}
                editable={!loading}
                onChange={(value) => {
                  setInputCode(value);
                  setHasTranslated(false);
                }}
              />
            )}
          </div>
          <div className="mt-8 flex h-full flex-col justify-center space-y-2 sm:mt-0 sm:w-2/4">
            {/* <div className="text-center text-xl font-bold">Bpftrace Program</div> */}

            {/* <LanguageSelect
              language={outputLanguage}
              onChange={(value) => {
                setOutputLanguage(value);
                setOutputCode('');
              }}
            /> */}
            <div className="w-full rounded-md bg-[#1F2937] px-4 py-2 text-neutral-200" align='center'>
              Bpftrace Program
            </div>
            {outputLanguage === 'Bash' ? (
              <CodeBlock code={`${outputCode}`} />
            ) : (
              <CodeBlock code={`${outputCode}`} />
            )}

          </div>
        </div>
      </div>
    </>
  );
}
