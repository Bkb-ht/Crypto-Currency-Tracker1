const express = require('express');
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const Member = require('../models/Member');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, memberId } = req.query;
    const query = {};

    if (status) query.status = status;
    if (memberId) query.member = memberId;

    const transactions = await Transaction.find(query)
      .populate('member', 'name email membershipId')
      .populate('book', 'title author isbn')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/borrow', auth, async (req, res) => {
  try {
    const { memberId, bookId, dueDate } = req.body;

    const member = await Member.findById(memberId);
    if (!member || !member.isActive) {
      return res.status(400).json({ message: 'Invalid or inactive member' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies available' });
    }

    const activeTransaction = await Transaction.findOne({
      member: memberId,
      book: bookId,
      status: 'active'
    });

    if (activeTransaction) {
      return res.status(400).json({ message: 'Member already has this book' });
    }

    const transaction = new Transaction({
      member: memberId,
      book: bookId,
      type: 'borrow',
      borrowDate: new Date(),
      dueDate: new Date(dueDate),
      status: 'active'
    });

    await transaction.save();

    book.availableCopies -= 1;
    await book.save();

    await transaction.populate('member', 'name email membershipId');
    await transaction.populate('book', 'title author isbn');

    res.status(201).json({
      message: 'Book borrowed successfully',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/return/:transactionId', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.transactionId)
      .populate('book');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status !== 'active') {
      return res.status(400).json({ message: 'Book already returned' });
    }

    const returnDate = new Date();
    let fine = 0;

    if (returnDate > transaction.dueDate) {
      const daysLate = Math.ceil((returnDate - transaction.dueDate) / (1000 * 60 * 60 * 24));
      fine = daysLate * 5;
    }

    transaction.returnDate = returnDate;
    transaction.status = 'returned';
    transaction.fine = fine;
    await transaction.save();

    const book = await Book.findById(transaction.book._id);
    book.availableCopies += 1;
    await book.save();

    await transaction.populate('member', 'name email membershipId');

    res.json({
      message: 'Book returned successfully',
      transaction,
      fine
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/overdue', auth, async (req, res) => {
  try {
    const overdueTransactions = await Transaction.find({
      status: 'active',
      dueDate: { $lt: new Date() }
    })
    .populate('member', 'name email membershipId')
    .populate('book', 'title author isbn')
    .sort({ dueDate: 1 });

    res.json(overdueTransactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;