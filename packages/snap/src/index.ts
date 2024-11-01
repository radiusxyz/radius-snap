/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/prefer-for-of */
import type { OnRpcRequestHandler } from '@metamask/snaps-sdk';
import { english, generateMnemonic, mnemonicToAccount } from 'viem/accounts';
import { createWalletClient, http, parseTransaction } from 'viem';
import { holesky } from 'viem/chains';
import { toHex, parseUnits } from 'viem/utils';
import axios from 'axios';

import { encryptMessage as encryptMessageSkde } from './skde';

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable camelcase */

export async function readStream(res: any) {
  const bytes = await res.arrayBuffer();
  const uint8bytes = new Uint8Array(bytes);
  return uint8bytes;
}

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
    case 'send': {
      const mnemonic = generateMnemonic(english);
      console.log(mnemonic);

      // guard ensure sample hockey fuel habit chair sport later neither water nephew
      const account = mnemonicToAccount(
        'guard ensure sample hockey fuel habit chair sport later neither water nephew',
      );
      console.log(account);

      const walletClient = createWalletClient({
        chain: holesky,
        transport: http(),
      });

      const myRequest = await walletClient.prepareTransactionRequest({
        account,
        to: request.params.to,
        value: parseUnits(request.params.amount, 18),
      });

      const serializedTransaction = await walletClient.signTransaction(
        myRequest,
      );
      console.log('serialized tx', serializedTransaction);
      const parsedTransaction = parseTransaction(serializedTransaction);

      console.log('parsed tx', parsedTransaction);

      const signature = await walletClient.sendRawTransaction({
        serializedTransaction,
      });

      console.log('signature', signature);
      console.log('hello world');

      // const skdeParamsStatic = {
      //   n: '109108784166676529682340577929498188950239585527883687884827626040722072371127456712391033422811328348170518576414206624244823392702116014678887602655605057984874271545556188865755301275371611259397284800785551682318694176857633188036311000733221068448165870969366710007572931433736793827320953175136545355129',
      //   g: '4',
      //   t: 4,
      //   h: '4294967296',
      //   max_sequencer_number: '2',
      // };

      // const messageSkde = JSON.stringify(parsedTransaction);

      // const encryptionKeySkdeStatic = {
      //   pk: '27897411317866240410600830526788165981341969904039758194675272671868652866892274441298243014317800177611419642993059565060538386730472765976439751299066279239018615809165217144853299923809516494049479159549907327351509242281465077907977695359158281231729142725042643997952251325328973964444619144348848423785',
      // };

      // const cipherTextSkde = await encryptMessageSkde(
      //   skdeParamsStatic,
      //   messageSkde,
      //   encryptionKeySkdeStatic,
      // );

      let skdeParams;
      let encryptionKeySkde;

      try {
        const response = await axios.post(
          'http://131.153.159.15:7100',
          {
            jsonrpc: '2.0',
            method: 'get_skde_params',
            params: {
              key_id: 579,
            },
            id: 1,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        skdeParams = response.data.result.skde_params;
        console.log('skde params', skdeParams);
      } catch (error) {
        console.error('Error:', error);
      }

      try {
        const response = await axios.post(
          'http://131.153.159.15:7100',
          {
            jsonrpc: '2.0',
            method: 'get_encryption_key',
            params: {
              key_id: 15,
            },
            id: 1,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        const a = response.data?.result?.encryption_key; // Adjust path based on response structure
        console.log('encryption key skde', a);
      } catch (error) {
        console.error('Error:', error);
      }

      const dataToEncrypt = JSON.stringify({
        to: request.params.to,
        value: serializedTransaction,
        data: request.params.data,
      });

      const encryptedData = await encryptMessageSkde(
        skdeParams,
        dataToEncrypt,
        encryptionKeySkde,
      );

      const url = 'http://131.153.159.15:3000';
      const encrypted_transaction = {
        jsonrpc: '2.0',
        method: 'send_encrypted_transaction',
        params: {
          rollup_id: 'nodeinfra_rollup',
          encrypted_transaction: {
            type: 'skde',
            data: {
              transaction_data: {
                type: 'eth',
                data: {
                  encrypted_data: encryptedData,
                  open_data: {
                    raw_tx_hash: serializedTransaction,
                    from: account.address,
                    nonce: toHex(parsedTransaction.nonce),
                    gas_price: toHex(parsedTransaction.maxFeePerGas),
                    gas_limit: toHex(parsedTransaction.gas),
                    signature: {
                      r: parsedTransaction.r,
                      s: parsedTransaction.s,
                      v: Number(parsedTransaction.v),
                    },
                    other: {},
                  },
                  plain_data: null,
                },
              },
              key_id: 167330,
            },
          },
        },
        id: 1,
      };
      console.log('hello world');
      console.log(encrypted_transaction);

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(encrypted_transaction),
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error:', error);
      }
      return { result: 'success' };
    }

    default: {
      throw new Error('Method not found.');
    }
  }
};

// send_encrypted_transaction

/* 

{
    "jsonrpc": "2.0",
    "method": "send_encrypted_transaction",
    "params": {
        "rollup_id": "1",
        "encrypted_transaction": {
            "Eth": {
                "open_data": {
                    "raw_tx_hash": "0x83b002caeea5a70ec6b94fd2cf71de5321fd3b94e7ce4535aea3028e31f3b10d",
                    "from": "0x0000000000000000000000000000000000000000",
                    "nonce": "0x2d4e1f",
                    "gas_price": "0x67e30ea2",
                    "gas_limit": "0x100590",
                    "signature": {
                        "r": "0x21f06184dd61bd7b87f8d4fc56bc209dbb1a4e0ce3d5cb1e6a56c55f9cf60620",
                        "s": "0x1e1ae25306ebb1419a41c67db3e511d610fc9a7d83f332b7d7e3c8df951c4a5d",
                        "v": 38
                    },
                    "block_hash": null,
                    "block_number": null,
                    "transaction_index": null,
                    "transaction_type": null,
                    "access_list": null,
                    "max_priority_fee_per_gas": null,
                    "max_fee_per_gas": null,
                    "chain_id": "0x1",
                    "other": {}
                },
                "encrypted_data": "16525341917024737325106484584322256261727777345172584850240990032472453366384,18488538614982294004435794039081061793350935819653198597435900081569039526077,6230648815369184305007482001088576712654738956149182620393845874603215881273,12401233369897484656358566955886484060734057798739037588129611310041623957115,21175029189302991762795590042455601872266681927727863287009485964694927814973,13821240530790539884852771460044449860040179161171802339242363981012597584540,6260241981239265167567320542523275272327604346343883556153166995075905315900,21462681774056542128505594737226307761395184979782399495385046509460076677449,18520849493129238815139461670727774242450518348518274719598694020770679495800,3509093391818943401296032238951422537722595892671004595967516868839725696816,4857335857986297547659622287291192668127310255940623242216228209336511490714,5093540281459397010638729846867768839561755688234861817584052684138856305482",
                "pvde_zkp": null
            }
        },
        "time_lock_puzzle": {
            "o": "24800632767858592699630021229619350340750515295123235515109382632361457959973462631494836542911461609615588445035146262900249613105057866944661823107276982940060681447663919671884062263565619849400305691748347334267117732649085728718857158770735476210710388838267460636764816992049770532127243050113527049841221368366375403619003551212954943237844718315030656359476553325704244754495205727026102328434495054390704815228730971524957467212888158618806421488481437734212884350072085334476673513602143257678445579792357566713658204719868253280227139656685411027713540888689251231536589989270059261228356031016983597592749",
            "t": 2048,
            "n": "25195908475657893494027183240048398571429282126204032027777137836043662020707595556264018525880784406918290641249515082189298559149176184502808489120072844992687392807287776735971418347270261896375014971824691165077613379859095700097330459748808428401797429100642458691817195118746121515172654632282216869987549182422433637259085141865462043576798423387184774447920739934236584823824281198163815010674810451660377306056201619676256133844143603833904414952634432190114657544454178424020924616515723350778707749817125772467962926386356373289912154831438167899885040445364023527381951378636564391212010397122822120720357"
        }
    },
    "id": 1
}

*/
