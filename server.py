#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Sep 23 01:02:30 2019

@author: Shamekh
"""
# import libraries 
import datetime     # each block has its own time stamp
import hashlib      # to hash the blocks
import json         # encode blocks before hashing

# webapp, postman res, node connecting (decenterlized)
from flask import Flask, jsonify, request 

from pymongo import MongoClient     #
import requests                     # catch node for consensus
from uuid import uuid4              # create addresses for nodes 
from urllib.parse import urlparse   # parse node URL
from flask_cors import CORS         # crossesd of py and js 
from bson.objectid import ObjectId  # handle db _id = ObjectId("..")


"""
PART 1:
    Initialize the Blockchain and Database Classes
"""
MONGO_URI = 'mongodb://localhost:27017/'
DB_NAME = 'nanocoin'

class Database:

    # constructor: intialize conection to mongo, db and collections 
    def __init__(self): 
        self.client = MongoClient(MONGO_URI) # mongodb URI
        self.db     = self.client[DB_NAME]   # initiate db 
        # initiate collections
        self.network        = self.db.available_network
        self.transactions   = self.db.bending_transactions 
        self.chain          = self.db.chain

    # extract transactions list from db
    def get_transactions(self):
        result = []
        transactions = self.transactions.find()
        for transaction in transactions:
            transaction['_id'] = str(transaction['_id'])
            result.append(transaction)
        return result
    
    # add new transaction to db
    def add_transaction(self, transaction):
        transaction_id = self.transactions.insert_one(transaction).inserted_id
        return str(transaction_id)
     
    # add new mined block to db
    def add_block(self, block):
        result = []
        transactions = self.transactions.find()
        for transaction in transactions:
            transaction['_id'] = str(transaction['_id'])
            result.append(transaction)    
        
        data = {'index':block['index'],
                'timestamp':block['timestamp'],
                'proof':block['proof'],
                'transactions': result,
                'previous_hash':block['previous_hash']}  
        block_id = self.chain.insert_one(data).inserted_id
        
        self.transactions.drop() # clear mined transactions from db
        return str(block_id)     # return block id for miner
    
    # get the main chain after reconnecting to network
    def get_chain(self):
        result = []
        transactions = self.chain.find()
        for block in transactions:
            block['_id'] = str(block['_id'])
            result.append(block)    
        return result
        

class Blockchain:
    
    # constructor: initialize server side calculation processes
    def __init__(self): 
        self.chain = []         # array of blocks
        self.transactions = []  # order matter
        self.nodes = set()      # for consensus protocol
        self.create_block(proof = 1, prev_hash = '0') # genesis block
        
    # create block 
    def create_block(self, proof, prev_hash):
        block = {'index': len(self.chain) + 1,
                 'timestamp': str(datetime.datetime.now()),
                 'proof': proof,
                 'transactions': self.transactions,
                 'previous_hash': prev_hash}
        self.transactions = []   # clear mined transactions
        self.chain.append(block) # add block to chain
        return block
    
    # extract last block in the chain for verification or rehashing
    def get_prev_block(self):
        return self.chain[-1]

    # find PoW that produce a hash with atleast 4 leading zero (miners competition)
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
    
    # hash block data
    def hash(self, block):
        encoded_block = json.dumps(block, sort_keys = True).encode() # suitable format for sha256, json for web uses, dumps -> dictionary to str
        return hashlib.sha256(encoded_block).hexdigest()
    
    # check chain validity (recompute hashes)
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
            hash_operation = hashlib.sha256(str(proof**2-prev_proof**2).encode()).hexdigest() # must be nonsymitrical 
            if hash_operation[:4] != '0000':
                return False
            prev_block = block
            block_index += 1
        return True
    
    # create a suitable format for the transaction (to hash later)
    def add_transaction(self, _id, sender, receiver, amount): 
        self.transactions.append({'_id': _id,
                                  'senders': sender,
                                  'receiver': receiver,
                                  'amount': amount})
        prev_block = self.get_prev_block() # add comments
        return prev_block['index'] + 1 
    
    # add users to the network for consensus 
    # protocols and request chain/transaction
    def add_node(self, address): 
        parsed_url = urlparse(address)
        self.nodes.add(parsed_url.netloc)

    # replace unvalid/older chains   
    # the longest chain survive
    def replace_chain(self): 
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
            

"""
PART 2:
    Web app + HTTP requests
"""

app = Flask(__name__)  # create falsk web app
CORS(app)              # allow react requests

# create node address (ports)
# for local development only
node_address = str(uuid4()).replace('-','')
# create the blockchain
database   = Database()
blockchain = Blockchain()
# add genesis
database.add_block(blockchain.get_prev_block()) 

# append transactions before mining the block
@app.route('/add_transaction', methods=['POST'])
def add_transaction():
    json = request.get_json() # req json file
    transaction_keys = ['sender', 'receiver', 'amount']
    if not all (key in json for key in transaction_keys): # keys missing from req
        response = {'msg': 'missing keys or values'}
        return jsonify(response), 400
    transaction_id = database.add_transaction(json);
    index = blockchain.add_transaction(transaction_id, json['sender'], json['receiver'], json['amount'])
    results = database.get_transactions()
    response = {'msg': f' added to block number {index} with id {transaction_id}',
                'chain': results}
    return jsonify(response), 201

# get transactions for front end to display
@app.route('/get_transactions', methods=['GET'])
def get_transactions():
    return jsonify({'msg':'your version of transactions has been updated',
                    'chain':database.get_transactions()}), 200

# delete transactions before mining
@app.route('/delete_transaction', methods=['DELETE'])
def delete_transaction():
    _id=request.args.get('_id');
    database.transactions.delete_one({'_id': ObjectId(_id)})
    return jsonify({'msg':'transaction deleted'}), 200

# update transactions before mining
@app.route('/update_transaction', methods=['PUT'])
def update_transaction():
    _id=request.args.get('_id');
    database.transactions.update_one({'_id': ObjectId(_id)},{"$set":request.get_json()})
    return jsonify({'msg':'transaction successfully updated'}), 200
        
# mining new block 
@app.route('/mine_block', methods=['POST'])
def mine_block():
    
    json = request.get_json() # req json file
    transaction_keys = ['sender', 'receiver', 'amount']
    if not all (key in json for key in transaction_keys): # keys missing from req
        response = {'msg': 'missing keys or values'}
        return jsonify(response), 400
    
    prev_block = blockchain.get_prev_block() # get genesis
    prev_proof = prev_block['proof']
    proof = blockchain.proof_of_work(prev_proof)
    
    transaction_id = database.add_transaction(json);
    blockchain.add_transaction(transaction_id, "system", "miner", "reward") # my reward
    prev_hash = blockchain.hash(prev_block) # genesis has no hash till this line
    
    block = blockchain.create_block(proof, prev_hash) 
    block_id = database.add_block(block)
    response = {'_id': str(block_id),
                'index':block['index'],
                'timestamp':block['timestamp'],
                'proof':block['proof'],
                'transactions': block['transactions'],
                'previous_hash':block['previous_hash']}    
    return jsonify(response), 200

# get blockchain for front end to display
@app.route('/get_chain', methods=['GET'])
def get_chain():
    response = database.get_chain()
    return jsonify({'msg':'your version of chain has been updated',
                    'chain':response}), 200

# getting the full blockchain
@app.route('/is_valid', methods=['GET'])
def is_valid():
    response = {'valid_chain': blockchain.is_chain_valid(blockchain.chain)}
    return jsonify(response), 200

"""
    PROTO:
        decentralize the blockchain 
"""
    
# connect to new node
@app.route('/connect_node', methods=['POST'])
def connect_node():
    json = request.get_json() # req json file
    nodes = json.get('nodes') # a file (kinda global) to regester nodes
    if nodes is None:
        return 'no nodes to connect', 400
    for node in nodes:
        database.network.insert_one({'node':node})
        blockchain.add_node(node)
    response = {'msg': 'nodes connected',
                'total_nodes': list(blockchain.nodes)}
    return jsonify(response), 201

# replace by longest chain if exists any
@app.route('/replace_chain', methods=['GET'])
def replace_chain():
    chain_replaced = blockchain.replace_chain()
    if chain_replaced:
        response = {'chain_replaced': jsonify(chain_replaced),
                    'new_chain': blockchain.chain}
    else:
         response = {'chain_replaced': chain_replaced}
    return jsonify(response), 200

# run the app (simple api)
app.run(host = '0.0.0.0', port = 5000)


"""
Notes:
    self => this object
"""
""" 
TODO 
    #0 Block 1 indexing
    #1 database extract for hashing
    #2 add hub for network connection in front end
"""   