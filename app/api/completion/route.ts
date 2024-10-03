import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { releases } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    prompt: `
    You are a helpful assistant that summarizes changelogs.
    Here is the changelog:
    ${releases.map((release) => `${release.tag_name}: ${release.body}`).join('\n')}

    Please summarize the changelog in a concise manner. Return only markdown.
    Split the summary into sections by type of change (e.g. New features, Bugs, BREAKING CHANGES and tech notes). Only include translation once.
    Do not include the version number in the summary. Do not include a header if there are no changes to that section. Use double line breaks to separate sections. Include items as bullet points.

    Example output: """
    ## Breaking changes
    - Removed feature X

    ## New features
    - Added feature Y

    ## Bugs
    - Fixed bug Z

    ## Other changes
    - Replaced dependency A with dependency B

    #### Last translation update: vXXX.XX.XX
    """
    `
  });

  return result.toDataStreamResponse();
}