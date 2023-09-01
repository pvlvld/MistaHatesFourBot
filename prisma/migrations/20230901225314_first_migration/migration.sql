-- CreateTable
CREATE TABLE "Chat" (
    "id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" BIGINT NOT NULL,
    "chatId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT,
    "fours" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId","chatId")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminToChat" (
    "adminId" BIGINT NOT NULL,
    "chatId" BIGINT NOT NULL,
    "has_del_perm" BOOLEAN NOT NULL,

    CONSTRAINT "AdminToChat_pkey" PRIMARY KEY ("adminId","chatId")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "chatId" BIGINT NOT NULL,
    "mista_enable" BOOLEAN NOT NULL,
    "vote_enable" BOOLEAN NOT NULL,
    "vote_percent" INTEGER NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chat_id_key" ON "Chat"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_id_key" ON "Admin"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_chatId_key" ON "Settings"("chatId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminToChat" ADD CONSTRAINT "AdminToChat_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminToChat" ADD CONSTRAINT "AdminToChat_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
