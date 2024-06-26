const loginReponse = (user, token) => {
    return {
        ...token, role: user.role, id: user.id, email: user.email,
        userDetailId: user.userdetail[0]?.id,
        access_group: user.access_group,
        linkDevice: user.linkDevice, isVerified: user.isVerified, status: user.status, rejectionreason: user.rejectionreason, userdetail: user.userdetail
    }
}

module.exports = loginReponse