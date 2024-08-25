-- CreateTable
CREATE TABLE "BankMock" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,

    CONSTRAINT "BankMock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankTransactions" (
    "id" SERIAL NOT NULL,
    "to" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "BankTransactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BankMock_cardNumber_key" ON "BankMock"("cardNumber");

-- CreateIndex
CREATE UNIQUE INDEX "BankTransactions_token_key" ON "BankTransactions"("token");

-- AddForeignKey
ALTER TABLE "BankTransactions" ADD CONSTRAINT "BankTransactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "BankMock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
