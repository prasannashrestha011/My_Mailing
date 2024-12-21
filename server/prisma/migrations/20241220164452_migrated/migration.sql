-- CreateTable
CREATE TABLE "user_model" (
    "userId" SERIAL NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_model_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "user_role" (
    "roleId" SERIAL NOT NULL,
    "roleName" TEXT NOT NULL,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("roleId")
);

-- CreateTable
CREATE TABLE "_role_junction" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_role_junction_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_model_emailAddress_key" ON "user_model"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "user_model_username_key" ON "user_model"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_role_roleName_key" ON "user_role"("roleName");

-- CreateIndex
CREATE INDEX "_role_junction_B_index" ON "_role_junction"("B");

-- AddForeignKey
ALTER TABLE "_role_junction" ADD CONSTRAINT "_role_junction_A_fkey" FOREIGN KEY ("A") REFERENCES "user_model"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_role_junction" ADD CONSTRAINT "_role_junction_B_fkey" FOREIGN KEY ("B") REFERENCES "user_role"("roleId") ON DELETE CASCADE ON UPDATE CASCADE;
