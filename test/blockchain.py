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
from flask import Flask, jsonify # webapp, postman res

# part 1 building blockchain

class Blockchain:
    
    def __init__(self): # constructor , self = this (object)
        self.chain = [] # array of blocks
        self.create_block(proof = 1, prev_hash = '0') # genesis block
        
    def create_block(self, proof, prev_hash):
        block = {'index': len(self.chain) + 1,
                 'timestamp': str(datetime.datetime.now()),
                 'proof': proof,
                 'previous_hash': prev_hash}
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
        
# part 2 mining block chain

# create web from falsk
app = Flask(__name__)           
# create the blockchain
blockchain = Blockchain()

# mining new block 
@app.route('/mine_block', methods=['GET'])
def mine_block():
    prev_block = blockchain.get_prev_block() # get genesis
    prev_proof = prev_block['proof']
    proof = blockchain.proof_of_work(prev_proof)
    prev_hash = blockchain.hash(prev_block) # genesis has no hash till this line
    block = blockchain.create_block(proof, prev_hash)
    response = {'message': ' Well done! you mined a block',
                'index':block['index'],
                'timestamp':block['timestamp'],
                'proof':block['proof'],
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


# run the app (simple api)
app.run(host = '0.0.0.0', port = 5000)