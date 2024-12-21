-- CreateTable
CREATE TABLE "user_profile" (
    "profileId" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "contactNumber" BIGINT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "profile_uri" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "user_profile_pkey" PRIMARY KEY ("profileId")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profile_contactNumber_key" ON "user_profile"("contactNumber");

-- CreateIndex
CREATE UNIQUE INDEX "user_profile_userId_key" ON "user_profile"("userId");

-- AddForeignKey
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_model"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
