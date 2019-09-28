#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Sep 25 01:38:59 2019

@author: oo
"""

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Sep 23 01:02:30 2019

@author: Shamekh
"""
# import libraries 

import datetime # each block has its own time stamp
import hashlib # to hash the blocks
import json # encode blocks before hashing
from flask import Flask, jsonify, request # webapp, postman res, node connecting (decenterlized)
import requests # catch node for consensus
from uuid import uuid4 # create addresses for nodes 
from urllib.parse import urlparse # parse node URL

################################
## part 1 building blockchain ##
################################

class Blockchain:
    
    def __init__(self): # constructor , self = this (object)
        self.chain = [] # array of blocks
        self.transactions = [] # order matter
        self.create_block(proof = 1, prev_hash = '0') # genesis block
        self.nodes = set() # other users for consensus protocol
        
    def create_block(self, proof, prev_hash):
        block = {'index': len(self.chain) + 1,
                 'timestamp': str(datetime.datetime.now()),
                 'proof': proof,
                 'transactions': self.transactions,
                 'previous_hash': prev_hash}
        self.transactions = [] # make it empty to avoid having 2 block with mutual transactions
        self.chain.append(block) # add block to chain
        return block
    
    def get_prev_block(self):
        return self.chain[-1]
    
    def proof_of_work(self, prev_proof):
        new_proof = 1
        check_proof = False
        while check_proof is False:
            hash_operation = hashlib.sha256(str(new_proof**2-prev_proof**2).encode()).hexdigest() # mest be nonsymmitrical 
            if hash_operation[:4] == '0000':
                check_proof = True
            else:
                new_proof += 1
        return new_proof
    
    def hash(self, block):
        encoded_block = json.dumps(block, sort_keys = True).encode() # suitable format for sha256, json for web uses, dumps -> dictionary to str
        return hashlib.sha256(encoded_block).hexdigest()
    
    def is_chain_valid(self, chain):
        prev_block = chain[0]
        block_index = 1
        while block_index < len(chain):
            block = chain[block_index]
            # check the prev block hash is correct
            if block['previous_hash'] != self.hash(prev_block):
                return False
            # check PoW
            prev_proof = prev_block['proof']
            proof = block['proof']
            hash_operation = hashlib.sha256(str(proof**2-prev_proof**2).encode()).hexdigest() # mest be nonsymitrical 
            if hash_operation[:4] != '0000':
                return False
            prev_block = block
            block_index += 1
        return True
    
    def add_transaction(self, sender, receiver, amount): # create a suitable format for the transaction (to hash later)
        self.transactions.append({'senders': sender,
                                  'receiver': receiver,
                                  'amount': amount})
        prev_block = self.get_prev_block() # add comments
        return prev_block['index'] + 1 
    
    def add_node(self, address): # network users
        parsed_url = urlparse(address)
        self.nodes.add(parsed_url.netloc)
        
    def replace_chain(self): # the longest chain survive
        network = self.nodes
        longest_chain = None
        max_length = len(self.chain)
        for node in network:
            response = requests.get(f'http://{node}/get_chain')
            if response.status_code == 200:
                length = response.json()['length']
                chain = response.json()['chain']
                if length > max_length and self.is_chain_valid(chain):
                    max_length = length
                    longest_chain = chain
        if longest_chain: # not None
            self.chain = longest_chain
            return True
        return False # no updates to chain
        
###############################
## part 2 mining block chain ##
###############################
            
# create web from falsk
app = Flask(__name__)    
# create node address (ports)
node_address = str(uuid4()).replace('-','')
# create the blockchain
blockchain = Blockchain()

# mining new block 
@app.route('/mine_block', methods=['GET'])
def mine_block():
    prev_block = blockchain.get_prev_block() # get genesis
    prev_proof = prev_block['proof']
    proof = blockchain.proof_of_work(prev_proof)
    blockchain.add_transaction(sender = node_address, receiver = 'Mustafa', amount = 1) # my reward
    prev_hash = blockchain.hash(prev_block) # genesis has no hash till this line
    block = blockchain.create_block(proof, prev_hash)
    response = {'message': ' Well done! you mined a block',
                'index':block['index'],
                'timestamp':block['timestamp'],
                'proof':block['proof'],
                'transactions': block['transactions'],
                'previous_hash':block['previous_hash']}
    return jsonify(response), 200

# getting the full blockchain
@app.route('/get_chain', methods=['GET'])
def get_chain():
    response = {'chain':blockchain.chain,
                'length':len(blockchain.chain)}
    return jsonify(response), 200

# getting the full blockchain
@app.route('/is_valid', methods=['GET'])
def is_valid():
    response = {'valid_chain': blockchain.is_chain_valid(blockchain.chain)}
    return jsonify(response), 200

# append a transaction to block before mining
@app.route('/add_transaction', methods=['POST'])
def add_transaction():
    json = request.get_json() # req json file
    transaction_keys = ['sender', 'receiver', 'amount']
    if not all (key in json for key in transaction_keys): # keys missing from req
        response = {'message': 'missing keys'}
        return jsonify(response), 400
    index = blockchain.add_transaction(json['sender'], json['receiver'], json['amount'])
    response = {'message': f'this transaction will be added to block number {index}'}
    return jsonify(response), 201

########################################
## part 3 decentralize the blockchain ##
########################################
    
# connect to new node
@app.route('/connect_node', methods=['POST'])
def connect_node():
    json = request.get_json() # req json file
    nodes = json.get('nodes') # a file (kinda global) to regester nodes
    if nodes is None:
        return 'no nodes to connect', 400
    for node in nodes:
        blockchain.add_node(node)
    response = {'message': 'nodes connected',
                'total_nodes': list(blockchain.nodes)}
    return jsonify(response), 201

# replace by longest chain if exists any
@app.route('/replace_chain', methods=['GET'])
def replace_chain():
    chain_replaced = blockchain.replace_chain()
    if chain_replaced:
        response = {'chain_replaced': chain_replaced,
                    'new_chain': blockchain.chain}
    else:
         response = {'chain_replaced': chain_replaced,
                     'network': list(blockchain.nodes)}
    return jsonify(response), 200

# run the app (simple api)
app.run(host = '0.0.0.0', port = 5001)