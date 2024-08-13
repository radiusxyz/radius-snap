import type { OnRpcRequestHandler } from '@metamask/snaps-sdk';
import { Box, Text, Bold } from '@metamask/snaps-sdk/jsx';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case 'hello':
      const name: string = 'Radius';
      const response = await getIndex(name);

      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: (
            <Box>
              <Text>
                Hello, <Bold>{origin}</Bold>!
              </Text>
              <Text>
                This custom confirmation is just for display purposes.
              </Text>
              <Text>
                But you can edit the snap source code to make it do something,
                if you want to!
              </Text>

              <Text>Hello, {response['result']} from the sequencer!</Text>
            </Box>
          ),
        },
      });
    default:
      throw new Error('Method not found.');
  }
};

async function getIndex(name: &string) {
  const response = await fetch('http://127.0.0.1:10000', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      'jsonrpc': '2.0',
      'method': 'Index',
      'params': [name],
      'id': 1,
    }),
  })
    .catch((error) => {
      throw new Error(error);
    });

  return await response.json();
}
